import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-password-reset-request',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatSnackBarModule,
  ],
  template: `
    <mat-dialog-content>
      <h2>Reset Password</h2>
      <p>Enter your email address to reset your password.</p>
      <mat-form-field appearance="fill">
        <mat-label>Email</mat-label>
        <input matInput [(ngModel)]="email" name="email" required />
      </mat-form-field>
      <button mat-raised-button color="primary" (click)="handlePassChange($event)">Reset Password</button>
    </mat-dialog-content>
  `,
  styles: [`
    mat-dialog-content {
      max-height: 400px;
      overflow: auto;
    }
  `]
})
export class PasswordResetRequestComponent {
  email: string = '';

  constructor(
    private dialogRef: MatDialogRef<PasswordResetRequestComponent>,
    private snackBar: MatSnackBar,
    private authService: AuthService,
  ) {}

  handlePassChange(event: Event) {
    event.preventDefault();
    if(this.email === '') {
      this.snackBar.open('Please add your email to reset your password.', 'Close', {
        duration: 3000,
      });
    }
    else {
      this.authService.resetPassword(this.email).subscribe({
        next: (response: any) => {
          const message = response.message || 'Password reset email sent. Please check your email.';
          this.snackBar.open(message, 'Close', {
            duration: 3000,
          });
          this.dialogRef.close();
        },
        error: (error: any) => {
          const errorMessage =
            error.error?.error || 'Password reset failed. Please try again.';
          this.snackBar.open(errorMessage, 'Close', {
            duration: 3000,
          });
        }
      });
    }
  }
}