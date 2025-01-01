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
import { TermsAndConditionsComponent } from './components/terms-and-conditions.component'; // Import the dialog component
import {MatIcon} from '@angular/material/icon';
@Component({
  selector: 'app-signup',
  standalone: true,
  styleUrls: ['./signup.component.scss'],
  templateUrl: './html/signup.html',
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
    MatIcon
  ],
  
  
})
export class SignupComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  acceptTerms: boolean = false; // New property for the checkbox
  hidePassword: boolean = true; // Property to toggle password visibility

  // Password strength criteria
  passwordCriteria = {
    length: false,
    symbol: false,
    numbers: false, // Added numbers
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
    this.passwordCriteria.numbers = /[0-9]/.test(password); // Added numbers
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
      this.passwordCriteria.numbers // Included numbers
    );
  }

  // Method to open the Terms and Conditions dialog
  openTerms(event: Event): void {
    event.preventDefault(); // Prevents the default link behavior
    this.dialog.open(TermsAndConditionsComponent, {
      width: '500px', 
    });
  }

  // Method to toggle password visibility
  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
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
