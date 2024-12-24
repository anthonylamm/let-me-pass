import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatSnackBarModule,
    MatIcon
  ],
  template: `
    <div class="reset-password-container">
      <mat-card class="reset-card">
        <mat-card-header>
          <mat-card-title>Reset Password</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form (ngSubmit)="onSubmit()">
            <mat-form-field appearance="fill">
              <mat-label>New Password</mat-label>
              <input 
                matInput 
                [type]="hidePassword ? 'password' : 'text'" 
                [(ngModel)]="newPassword" 
                name="newPassword" 
                required 
                (input)="checkPasswordStrength(newPassword)"
              >
              <button mat-icon-button matSuffix type="button" (click)="togglePasswordVisibility()">
                <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
            </mat-form-field>

            <div class="password-strength">
              <p>Password Strength:</p>
              <ul>
                <li [ngStyle]="{ color: passwordCriteria.length ? 'green' : 'red' }">
                  &#10004; At least 6 characters
                </li>
                <li [ngStyle]="{ color: passwordCriteria.letters ? 'green' : 'red' }">
                  &#10004; Contains letters
                </li>
                <li [ngStyle]="{ color: passwordCriteria.numbers ? 'green' : 'red' }">
                  &#10004; Contains numbers
                </li>
                <li [ngStyle]="{ color: passwordCriteria.symbol ? 'green' : 'red' }">
                  &#10004; Includes a symbol (!, #, $, etc.)
                </li>
              </ul>
            </div>

            <mat-form-field appearance="fill">
              <mat-label>Confirm Password</mat-label>
              <input 
                matInput 
                [type]="hideConfirmPassword ? 'password' : 'text'" 
                [(ngModel)]="confirmPassword" 
                name="confirmPassword" 
                required 
              >
              <button mat-icon-button matSuffix type="button" (click)="toggleConfirmPasswordVisibility()">
                <mat-icon>{{hideConfirmPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" [disabled]="!isPasswordStrong() || loading">
              Reset Password
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  newPassword: string = '';
  confirmPassword: string = '';
  token: string = '';
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;
  loading: boolean = false;

  // Updated password criteria to include letters, numbers, and symbols
  passwordCriteria = {
    length: false,
    letters: false,
    numbers: false,
    symbol: false
  };

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Extract the token from query parameters
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
      if (!this.token) {
        this.snackBar.open('Invalid or missing token.', 'Close', { duration: 3000 });
        this.router.navigate(['/login']);
      }
    });
  }

  // Updated method to check password strength based on letters, numbers, and symbols
  checkPasswordStrength(password: string): void {
    this.passwordCriteria.length = password.length >= 6;
    this.passwordCriteria.letters = /[A-Za-z]/.test(password);
    this.passwordCriteria.numbers = /[0-9]/.test(password);
    this.passwordCriteria.symbol = /[^A-Za-z0-9]/.test(password); // Updated regex to catch any non-alphanumeric character
  }

  // Method to determine if password is strong based on updated criteria
  isPasswordStrong(): boolean {
    return (
      this.passwordCriteria.length &&
      this.passwordCriteria.letters &&
      this.passwordCriteria.numbers &&
      this.passwordCriteria.symbol
    );
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  onSubmit(): void {
    console.log('Reset password form submitted:', this.newPassword, this.confirmPassword);
    if (this.newPassword !== this.confirmPassword) {
      this.snackBar.open('Passwords do not match.', 'Close', { duration: 3000 });
      return;
    }

    if (!this.isPasswordStrong()) {
      this.snackBar.open('Password does not meet the required criteria.', 'Close', { duration: 3000 });
      return;
    }

    if (!this.token) {
      this.snackBar.open('Invalid or missing token.', 'Close', { duration: 3000 });
      this.router.navigate(['/login']);
      return;
    }

    this.loading = true;

    // Call the AuthService to reset the password
    this.authService.confirmResetPassword(this.token, this.newPassword).subscribe({
      next: (response: any) => {
        this.snackBar.open('Password has been reset successfully.', 'Close', { duration: 3000 });
        console.log('Password reset response:', response);
        this.router.navigate(['/login']);
        this.loading = false;
      },
      error: (error: any) => {
        // Display specific error messages from backend
        if (error.error && error.error.errors) {
          error.error.errors.forEach((err: any) => {
            this.snackBar.open(err.msg, 'Close', { duration: 3000 });
          });
        } else if (error.error && error.error.error) {
          this.snackBar.open(error.error.error, 'Close', { duration: 3000 });
        } else {
          this.snackBar.open('Password reset failed. Please try again.', 'Close', { duration: 3000 });
        }
        console.error('Password reset error:', error);
        this.loading = false;
      }
    });
  }
}
