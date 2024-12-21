import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar for user feedback

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
  ],
  template: `
    <mat-card style="max-width: 400px; margin: 50px auto; padding: 20px;">
      <h2>Login</h2>
      <form (ngSubmit)="onLogin()">
        <mat-form-field appearance="fill" style="width: 100%; margin-bottom: 15px;">
          <mat-label>Username</mat-label>
          <input matInput [(ngModel)]="username" name="username" required />
        </mat-form-field>

        <mat-form-field appearance="fill" style="width: 100%; margin-bottom: 15px;">
          <mat-label>Password</mat-label>
          <input matInput type="password" [(ngModel)]="password" name="password" required />
        </mat-form-field>

        <div style="text-align: right;">
          <button mat-raised-button color="primary" type="submit">Login</button>
          <button mat-button color="accent" type="button" (click)="onSignup()">Signup</button>
        </div>
      </form>
    </mat-card>
  `,
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar // Inject MatSnackBar
  ) {}

  onLogin() {
    if (!this.username || !this.password) {
      this.snackBar.open('Please enter both username and password.', 'Close', {
        duration: 3000,
      });
      return;
    }
    this.authService.login(this.username, this.password).subscribe(
      (response: any) => {
        console.log('Login response:', response);
        this.authService.setToken(response.token);
        this.router.navigate(['/']);
      },
      (error: any) => {
        console.error('Login error:', error);
        this.snackBar.open('Invalid username or password.', 'Close', {
          duration: 3000,
        });
      }
    );
  }

  onSignup() {
    // Navigate to the signup page
    this.router.navigate(['/signup']);
  }
}
