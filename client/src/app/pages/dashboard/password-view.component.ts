import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input'; // Added MatInputModule
import { MatButtonModule } from '@angular/material/button';
import { PasswordService } from '../../services/password.service';
import { UserService} from '../../services/user.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ModifyPassword } from './modify-password.component'
import { decode } from 'html-entities';
import { ClipboardModule, Clipboard } from '@angular/cdk/clipboard';
import { CryptoService } from '../../services/crypto.service';

@Component({
  selector: 'app-password-view',
  templateUrl: './html/password-view.html',
  standalone: true,
  styleUrls: ['./styles/password-view.scss'],
  imports: [
    MatCardModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule, // Included in imports
    MatSnackBarModule,
    MatDialogModule,
    ClipboardModule
  ]
})
export class PasswordViewComponent implements OnInit {
  passwordData: any;
  passwordForm: FormGroup;
  hidePassword: boolean = true; // For password visibility toggle
  isEditMode: boolean = false;
  originalPasswordData: any; // To store original data for cancel operation

  decode = decode; // Expose decode to the template

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private passwordService: PasswordService,
    private userService: UserService,
    private snackBar : MatSnackBar,
    private dialog: MatDialog,
    private clipboard: Clipboard,
    private cryptoService: CryptoService,
  ){
    this.passwordForm = this.fb.group({
      username: [{ value: '', disabled: true }, Validators.required],
      password: [{ value: '', disabled: true }, Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w .-]*)*/?')],
      siteurl: [{ value: '', disabled: true }, Validators.required],
      sitename: [{ value: '', disabled: true },  Validators.required],
      notes: [{ value: '', disabled: true }]
    });
  }

  
  ngOnInit(): void {
    this.passwordData = this.passwordService.getSelectedPasswordData();

    if (!this.passwordData) {
      console.warn('No password data found. Redirecting to dashboard.');
      this.router.navigate(['/dashboard']);
    } else {
      this.userService.getUserPassword(this.passwordData.password_id).subscribe({
        next: async(response: any) => {

          if (response.results && response.results.length > 0) {
            const passwordDetails = response.results[0];

            this.originalPasswordData = passwordDetails
            
              try {
              // Check if encryption key is derived
              if (!this.cryptoService.isKeyDerived()) {
                this.snackBar.open('Encryption key expired. Please log in again.', 'Close', {
                  duration: 3000,
                });
                this.router.navigate(['/login']);

                return;
              }
              // Decrypt the password using CryptoService
              const decryptedPassword = await this.cryptoService.decryptData(passwordDetails.encryptedpassword);

              // Patch the form with decrypted password and other details
              this.passwordForm.patchValue({
                username: passwordDetails.username,
                password: decryptedPassword, 
                siteurl: this.decode(passwordDetails.siteurl),
                sitename: passwordDetails.sitename,
                notes: passwordDetails.notes
              });
            } catch (decryptionError) {
              console.error('Decryption error:', decryptionError);
              this.snackBar.open('Error decrypting password. Please try again.', 'Close', {
                duration: 3000,
              });
            }
          }
        },
        error:(error: any) => {

        }
      })

     }

  }
  getFaviconUrl(siteurl: string): string {
    try {
      const decodedHtml = decode(siteurl);
      const decodedUrl = decodeURIComponent(decodedHtml);
      
      if (!decodedUrl) {
        throw new Error('Empty URL');
      }

      const url = new URL(decodedUrl);
      const faviconUrl = `https://icons.duckduckgo.com/ip3/${url.hostname}.ico`;

      return faviconUrl;
    } catch (error) {
      console.error('Invalid URL:', siteurl);
      return 'assets/default-favicon.ico';
    }
  }
  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
  goback(): void{
    this.router.navigate(['/dashboard']);

  }
  delete(): void {
    const userConfirmed = window.confirm('Are you sure you want to delete this password entry?');
    
    if (userConfirmed) {
      this.userService.deleteUserPassword(this.passwordData.password_id).subscribe({
        next: (response: any) => {
          console.log('Password deleted successfully:', response);
          this.router.navigate(['/dashboard']);
          this.snackBar.open('Login information successfully deleted.', 'Close', {
            duration: 3000,
          });
        },
        error: (error: any) => {
          console.error('Error deleting password:', error);
          this.snackBar.open('Failed to delete password. Please try again.', 'Close', {
            duration: 3000,
          });
        }
      });
    }
  }
  

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
  enableEdit(event: Event): void {
    event.preventDefault();
    this.dialog.open(ModifyPassword, {
          width: '600px',
          height: '600px',
          data: this.originalPasswordData
        });

  }
  copyToClipboard(data: string): void {
    this.clipboard.copy(data);
    this.snackBar.open('Copied to clipboard!', 'Close', {
      duration: 2000,
      verticalPosition: 'bottom',
    });
  }

 
}
