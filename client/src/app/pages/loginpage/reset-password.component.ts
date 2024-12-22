import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button'; // Added for buttons
import { MatDialogModule } from '@angular/material/dialog'; // Ensure MatDialogModule is correctly imported
import { MatCardHeader, MatCardModule } from '@angular/material/card';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true, 
  imports: [
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,      
    FormsModule,
    MatButtonModule,
    MatSnackBarModule,    
  ],
  template: `

  <mat-card>
    <div>
      <h2>Reset Password</h2>
      <p>Enter your email address to reset your password.</p>
      <mat-form-field appearance="fill">
        <mat-label>Email</mat-label>
        <input matInput [(ngModel)]="email" name="email" required />
      </mat-form-field>
      <button mat-raised-button color="primary" (click)="handlePassChange($event)">Reset Password</button>
    </div>
  </mat-card>
  `,

})
export class ResetPasswordComponent {
  email: string = '';

  constructor(
  private dialogRef: MatDialogRef<ResetPasswordComponent>,
  private snackBar: MatSnackBar,
  private authService: AuthService,
  
) {}

  handlePassChange(event: Event) {
    event.preventDefault(); // Prevent default form submission behavior
    if(this.email === '') {
      this.snackBar.open('Please add your email to reset your password.', 'Close', {
        duration: 3000,
      });
    }
    else {
      this.authService.resetPassword(this.email).subscribe({
        next: (response: any) => {
          const message = response.message || 'Password reset email sent. Please check your email.';
          console.log(response);//remove in production
          this.snackBar.open(message, 'Close', {
            duration: 3000,
          });
          this.dialogRef.close();
        },
        error: (error: any) => {
          const errorMessage =
            error.error?.error || 'Signup failed. Please try again.';
          this.snackBar.open(errorMessage, 'Close', {
            duration: 3000,
          });
        }
      });
      
    }
  }
}
