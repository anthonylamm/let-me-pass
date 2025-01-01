import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { CryptoService } from '../../services/crypto.service';

@Component({
  selector: 'app-add-password-dialog',
  templateUrl: './html/add-password-dialog.html',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatIconModule
  ],
  standalone: true, // Ensure this line is present
  styleUrls: ['./styles/add-password.scss'],
  encapsulation: ViewEncapsulation.None, // Ensure this line is appropriately set
})
export class AddPasswordDialogComponent {
  passwordForm: FormGroup;
  hidePassword: boolean = true; // For password visibility toggle

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddPasswordDialogComponent>,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private cryptoService : CryptoService,
  ) {
    this.passwordForm = this.fb.group({
      siteurl: ['', [Validators.required, Validators.pattern('https?://.+')]],
      username: ['', Validators.required],
      password: ['', Validators.required],
      notes: ['']
    });
  }

  
  async onSubmit(): Promise<void> {
    if (this.passwordForm.valid) {
      const { sitename, siteurl, username, password, notes } = this.passwordForm.value;

      // Check if encryption key is derived
      if (!this.cryptoService.isKeyDerived()) {
        this.snackBar.open('Encryption key not available. Please log in again.', 'Close', {
          duration: 3000,
        });
        return;
      }

      try {
        // Encrypt the password using CryptoService
        const encryptedPassword = await this.cryptoService.encryptData(password);

        // Send the encrypted password to the server
        this.userService.addPassword(sitename, username, siteurl, encryptedPassword, notes).subscribe({
          next: (response: any) => {
            this.snackBar.open(response.message, 'Close', {
              duration: 3000,
            });
            this.dialogRef.close(this.passwordForm.value);
          },
          error: (err) => {
            this.snackBar.open('Error adding password', 'Close', {
              duration: 3000,
            });
          }
        });
      } catch (error) {
        console.error('Encryption error:', error);
        this.snackBar.open('Error encrypting password', 'Close', {
          duration: 3000,
        });
      }
    }
  }
  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
  onCancel(): void {
    this.dialogRef.close();
  }
}
