import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatCard } from '@angular/material/card';
import { CommonModule } from '@angular/common'; // Add this import
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-email-verified',
  templateUrl: './email-verified.component.html',
  styleUrls: ['./email-verified.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCard,
    MatButtonModule
  ]
})
export class EmailVerifiedComponent implements OnInit {
  verificationStatus: string = 'Verifying...';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.verifyEmail(token);
      } else {
        this.verificationStatus = 'Invalid or missing token.';
      }
    });
  }

  verifyEmail(token: string): void {
    this.authService.verifyEmail(token)
      .subscribe({
        next: (response: any) => {
          this.verificationStatus = 'Your email has been successfully verified. You can now log in to your account.';
          
        },
        error: (error: any) => {
          console.error('Email verification error:', error);
          this.verificationStatus = 'Email verification failed. The token may be invalid or expired.';
        }
      });
  }
  navLogin(): void {
    this.router.navigate(['/login']);
  }

}
