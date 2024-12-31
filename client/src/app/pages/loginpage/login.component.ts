import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider'; // Import MatDividerModule
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { PasswordResetRequestComponent } from './components/password-reset-request.component'; // Import ResetPasswordComponent
import { MatDialog } from '@angular/material/dialog'; // Import MatDialog
import { MatIcon } from '@angular/material/icon';
import { CryptoService } from '../../services/crypto.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./signup.component.scss'],
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule, // Add MatDividerModule to imports
    MatSnackBarModule,
    CommonModule,
    FormsModule,
    MatIcon,
  ],
  
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  hidePassword: boolean = true; 

 

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private cryptoService: CryptoService,
  ) {}

  isFormValid(): boolean {
    return this.username.trim() !== '' && this.password.trim() !== '';
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  async onLogin(): Promise<void> {
    if (!this.username || !this.password) {
      this.snackBar.open('Please enter both username and password.', 'Close', {
        duration: 3000,
      });
      return;
    }
    this.authService.login(this.username, this.password).subscribe({
      next: async (response: any) => {
        this.authService.setToken(response.token);
        if (response.token && response.salt) {
          // Store the authentication token
          this.authService.setToken(response.token);
        }  
        this.cryptoService.setSalt(response.salt);
        // Derive the encryption key using the master password
        await this.cryptoService.deriveKey(this.password);

        this.snackBar.open('Login successful!', 'Close', {
          duration: 3000,
        });
        this.router.navigate(['/dashboard']); // Redirect to dashboard or desired route
      },
      error: (error: any) => {
        console.error('Login error:', error); // Log the error
        this.snackBar.open('Login failed. Please try again.', 'Close', {
          duration: 3000,
        });
      }
    });
  }

  openRecoverPass(event: Event) {
    event.preventDefault();
    this.dialog.open(PasswordResetRequestComponent, {
      width: '300px',
    });
  }

  onSignup() {
    this.router.navigate(['/signup']);
  }
}
