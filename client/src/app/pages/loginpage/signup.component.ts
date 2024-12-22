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


@Component({
  selector: 'app-signup',
  standalone: true,
  styleUrls: ['./signup.component.scss'],
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    CommonModule,
    FormsModule,
    MatDividerModule
    
  ],
  template: `
    <mat-card class="signup-card">
      <h2>Signup</h2>
      <form (ngSubmit)="onSignup()">
        <mat-form-field appearance="fill" style="width: 100%; margin-bottom: 15px;">
          <mat-label>Username</mat-label>
          <input matInput [(ngModel)]="username" name="username" required />
        </mat-form-field>

        <mat-form-field appearance="fill" style="width: 100%; margin-bottom: 15px;">
          <mat-label>Email</mat-label>
          <input matInput type="email" [(ngModel)]="email" name="email" required />
        </mat-form-field>

        <mat-form-field appearance="fill" style="width: 100%; margin-bottom: 15px;">
          <mat-label>Password</mat-label>
          <input matInput type="password" [(ngModel)]="password" name="password" required (ngModelChange)="checkPasswordStrength()" />
        </mat-form-field>

        <!-- Password Strength Indicators -->
        <div style="margin-bottom: 15px;">
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

        <div class="buttons-container" >
          <button mat-raised-button color="accent" type="submit" [disabled]="!isPasswordStrong()" class="signup-button" >Signup</button>
          <div class="divider-container">
            <mat-divider></mat-divider>
            <span class="divider-text">OR</span>
            <mat-divider></mat-divider>
          </div>
          <button mat-raised-button color="accent" (click)="onLogin()" class="signup-button">Login</button>
        </div>
      </form>
    </mat-card>
  `,
})
export class SignupComponent {
  username: string = '';
  email: string = '';
  password: string = '';

  // Password strength criteria
  passwordCriteria = {
    length: false,
    symbol: false,
    capital: false,
  };
  
  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  
  ) {}// Inject the Router service

  // Method to check password strength
  checkPasswordStrength() {
    const password = this.password;
    this.passwordCriteria.length = password.length >= 6;
    this.passwordCriteria.symbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    this.passwordCriteria.capital = /[A-Z]/.test(password);
  }

  // Method to determine if password is strong
  isPasswordStrong(): boolean {
    return (
      this.passwordCriteria.length &&
      this.passwordCriteria.symbol &&
      this.passwordCriteria.capital
    );
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

    this.authService.signup(this.username, this.email, this.password).subscribe({//backend api call to register user 
      next: (response: any ) =>{
        console.log(response);

        this.snackBar.open('Registration successful! Check your email to verify your account.', 'Close', {
          duration: 5000, // milliseconds
          panelClass: ['snackbar-success'] // need to look at adding custom styles
        });

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 5000); // directed to login after 5 seconds
        

      },
      error: (error: any) =>{
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
