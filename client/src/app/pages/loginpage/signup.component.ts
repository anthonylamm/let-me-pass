import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { TermsAndConditionsComponent } from './terms-and-conditions.component'; // Import the dialog component

@Component({
  selector: 'app-signup',
  standalone: true,
  styleUrls: ['./signup.component.scss'],
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDividerModule,
    MatSnackBarModule,
    CommonModule,
    FormsModule,
    TermsAndConditionsComponent, // Declare the dialog component
  ],
  template: `
    <mat-card class="signup-card">
      <h2>Signup</h2>
      <form (ngSubmit)="onSignup()">
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Username</mat-label>
          <input matInput [(ngModel)]="username" name="username" required />
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput type="email" [(ngModel)]="email" name="email" required />
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Password</mat-label>
          <input
            matInput
            type="password"
            [(ngModel)]="password"
            name="password"
            required
            (ngModelChange)="checkPasswordStrength()"
          />
        </mat-form-field>

        <!-- Password Strength Indicators -->
        <div class="password-strength">
          <p>Password Strength:</p>
          <ul>
            <li [ngStyle]="{ color: passwordCriteria.length ? 'green' : 'red' }">
              &#10004; At least 6 characters
            </li>
            <li [ngStyle]="{ color: passwordCriteria.symbol ? 'green' : 'red' }">
              &#10004; Includes a symbol (!,#,$, etc.)
            </li>
            <li [ngStyle]="{ color: passwordCriteria.capital ? 'green' : 'red' }">
              &#10004; Contains a capital letter
            </li>
          </ul>
        </div>

        <!-- Terms and Conditions Checkbox -->
        <div class="terms-container">
        <mat-checkbox [(ngModel)]="acceptTerms" name="acceptTerms" required>
          I agree to the 
          <a href="#" (click)="openTerms($event)">terms and conditions</a>
        </mat-checkbox>
        </div>

        <div class="buttons-container">
          <button
            mat-raised-button
            color="accent"
            type="submit"
            [disabled]="!isFormValid()"
            class="signup-button"
          >
            Signup
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
            (click)="onLogin()"
            class="signup-button"
          >
            Login
          </button>
        </div>
      </form>
    </mat-card>
  `,
})
export class SignupComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  acceptTerms: boolean = false; // New property for the checkbox

  // Password strength criteria
  passwordCriteria = {
    length: false,
    symbol: false,
    capital: false,
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog // Inject MatDialog
  ) {}

  // Method to check password strength
  checkPasswordStrength() {
    const password = this.password;
    this.passwordCriteria.length = password.length >= 6;
    this.passwordCriteria.symbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    this.passwordCriteria.capital = /[A-Z]/.test(password);
  }

  // Method to determine if form is valid
  isFormValid(): boolean {
    return this.isPasswordStrong() && this.acceptTerms;
  }

  // Method to determine if password is strong
  isPasswordStrong(): boolean {
    return (
      this.passwordCriteria.length &&
      this.passwordCriteria.symbol &&
      this.passwordCriteria.capital
    );
  }

  // Method to open the Terms and Conditions dialog
  openTerms(event: Event): void {
    event.preventDefault(); // Prevents the default link behavior
    this.dialog.open(TermsAndConditionsComponent, {
      width: '500px', 
    });
  }

  onSignup() {
    console.log('Username:', this.username);
    console.log('Email:', this.email);
    console.log('Password:', this.password);

    if (!this.isPasswordStrong()) {
      this.snackBar.open(
        'Password does not meet the required strength criteria.',
        'Close',
        {
          duration: 3000,
        }
      );
      return;
    }

    if (!this.acceptTerms) {
      this.snackBar.open('You must agree to the terms and conditions.', 'Close', {
        duration: 3000,
      });
      return;
    }

    this.authService.signup(this.username, this.email, this.password).subscribe({
      next: (response: any) => {
        console.log(response);

        this.snackBar.open(
          'Registration successful! Check your email to verify your account.',
          'Close',
          {
            duration: 5000, // milliseconds
            panelClass: ['snackbar-success'], // Ensure you have styles for this class
          }
        );

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 5000); // Redirect to login after 5 seconds
      },
      error: (error: any) => {
        console.log( error);
        console.error('Signup error:', error);
        const errorMessage =
          error.error?.error || 'Signup failed. Please try again.';
        this.snackBar.open(errorMessage, 'Close', {
          duration: 3000,
        });
      },
    });
  }

  onLogin() {
    this.router.navigate(['/login']);
  }
}
