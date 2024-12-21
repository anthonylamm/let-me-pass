import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';


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
    <mat-card style="max-width: 400px; margin: auto; padding: 1rem;">
      <h2>Login</h2>
      <form>
        <mat-form-field appearance="fill" style="display: block; margin-bottom: 1rem;">
          <mat-label>Username</mat-label>
          <input matInput [(ngModel)]="username" name="username" />
        </mat-form-field>

        <mat-form-field appearance="fill" style="display: block; margin-bottom: 1rem;">
          <mat-label>Password</mat-label>
          <input matInput type="password" [(ngModel)]="password" name="password" />
        </mat-form-field>

        <button mat-raised-button color="primary" (click)="onLogin()">
          Login
        </button>
        <a routerLink="/signup">Signup</a>
        
      </form>
    </mat-card>
  `,
})
export class LoginComponent {
  username = '';
  password = '';

  onLogin() {
    // Handle login logic here
    console.log('Username:', this.username);
    console.log('Password:', this.password);
  }
}
