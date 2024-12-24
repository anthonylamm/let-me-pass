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
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
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
  template: `
    <mat-card class="login-card">
      <h2>Welcome back!</h2>
      <form (ngSubmit)="onLogin()">
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Username</mat-label>
          <input matInput [(ngModel)]="username" name="username" required />
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Password</mat-label>
          <input matInput [type]="hidePassword ? 'password' : 'text'" [(ngModel)]="password" name="password" required />
          <button mat-icon-button matSuffix type="button" (click)="togglePasswordVisibility()">
            <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
          </button>
        </mat-form-field>

        <div class="terms-container">
          <a href="#" (click)="openRecoverPass($event)">Forgot password?</a>
        </div>

        <div class="buttons-container">
          <button
            mat-raised-button
            color="primary"
            type="submit"
            class="login-button"
            [disabled]="!isFormValid()"
          >
            Continue
          </button>

          <div class="divider-container">
            <mat-divider></mat-divider>
            <span class="divider-text">OR</span>
            <mat-divider></mat-divider>
          </div>

          <button
            mat-raised-button 
            color="accent"
            type="button"
            (click)="onSignup()"
            class="signup-button"
          >
            Signup
          </button>
        </div>
      </form>
    </mat-card>
  `,
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  hidePassword: boolean = true; // Property to toggle password visibility

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  // Method to check if the form is valid
  isFormValid(): boolean {
    return this.username.trim() !== '' && this.password.trim() !== '';
  }

  // Method to toggle password visibility
  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  onLogin() {
    if (!this.username || !this.password) {
      this.snackBar.open('Please enter both username and password.', 'Close', {
        duration: 3000,
      });
      return;
    }
    this.authService.login(this.username, this.password).subscribe({
      next: (response: any) => {
        console.log('Login response:', response); // For testing; remove in production
        this.authService.setToken(response.token);
        this.snackBar.open('Login successful!', 'Close', {
          duration: 3000,
        });
        this.router.navigate(['/dashboard']); // Redirect to dashboard or desired route
      },
      error: (error: any) => {
        console.error('Login error:', error);
        const errorMessage =
          error.error?.error || 'Login failed. Please try again.';
        this.snackBar.open(errorMessage, 'Close', {
          duration: 3000,
        });
      },
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
