import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
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
          <input matInput type="password" [(ngModel)]="password" name="password" required />
        </mat-form-field>

        <div style="text-align: right;">
          <button mat-raised-button color="accent" type="submit">Signup</button>
          <a mat-button color="accent" (click)="onLogin()">Login</a>

        </div>
      </form>
    </mat-card>
  `,
})
export class SignupComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  
  constructor(private router: Router) {}// Inject the Router service

  onSignup() {
    // Handle signup logic here
    console.log('Username:', this.username);
    console.log('Email:', this.email);
    console.log('Password:', this.password);

    // Redirect to login after signup
    // this.router.navigate(['/login']);
  }
  onLogin() {
 
     this.router.navigate(['/login']);
  }
}
