import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input'; // Added MatInputModule
import { MatButtonModule } from '@angular/material/button';
import { PasswordService } from '../../services/password.service';
import { UserService} from '../../services/user.service';

import { decode } from 'html-entities';

@Component({
  selector: 'app-password-view',
  templateUrl: './html/password-view.html',
  standalone: true,
  styleUrls: ['./html/password-view.scss'],
  imports: [
    MatCardModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule // Included in imports
  ]
})
export class PasswordViewComponent implements OnInit {
  passwordData: any;
  passwordForm: FormGroup;
  hidePassword: boolean = true; // For password visibility toggle
  decode = decode; // Expose decode to the template

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private passwordService: PasswordService,
    private userService: UserService
  ){
    this.passwordForm = this.fb.group({
      username: [{ value: '', disabled: true }],
      password: [{ value: '', disabled: true }],
      siteurl: [{ value: '', disabled: true }],
      sitename: [{ value: '', disabled: true }],
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
        next: (response: any) => {
          console.log(response)

          if (response.results && response.results.length > 0) {
            const passwordDetails = response.results[0];
            
            this.passwordForm.patchValue({
              username: passwordDetails.username,
              password: passwordDetails.encryptedpassword, 
              siteurl: decode(passwordDetails.siteurl),
              sitename: passwordDetails.sitename,
              notes: passwordDetails.notes
            });
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

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
 
}
