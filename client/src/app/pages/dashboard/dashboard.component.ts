import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddPasswordDialogComponent } from './addpassword/add-password-dialog.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { decode } from 'html-entities';

@Component({
  selector: 'app-dashboard',
  templateUrl: './html/dashboard.html',
  standalone: true,
  styleUrls: ['./html/dashboard.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ]
})
export class DashboardComponent implements OnInit {
  passwordForm: FormGroup;
  displayedColumns: string[] = ['icon', 'sitename', 'siteurl'];
  dataSource: any[] = [];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) {
    this.passwordForm = this.fb.group({
      sitename: [''],
      siteurl: [''],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.displayUserInfo();
  }

  async displayUserInfo() {
    try {
      const token = localStorage.getItem('token');

      // Check if the token exists
      if (token) {
        console.log('JWT is present in local storage:', token);
        const response: any = await firstValueFrom(this.userService.getUserInfo());
        console.log('displaying user password info...', response);
        this.dataSource = response.results;
      } else {
        console.log('JWT is not found in local storage.');
        this.router.navigate(['/login']);
      }
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        console.error('Unauthorized access - possibly invalid token:', error.message);
        this.router.navigate(['/login']);
      } else {
        console.error('Error fetching user info:', error);
      }
    }
  }

  getFaviconUrl(siteurl: string): string {
    try {
      const decodedHtml = decode(siteurl);
      const decodedUrl = decodeURIComponent(decodedHtml);
      
      if (!decodedUrl) {
        throw new Error('Empty URL');
      }

      const url = new URL(decodedUrl);
      const faviconUrl = `https://icons.duckduckgo.com/ip3/${url.hostname}.ico`;
      console.log('Favicon URL:', faviconUrl);
      return faviconUrl;
    } catch (error) {
      console.error('Invalid URL:', siteurl);
      return 'assets/default-favicon.ico';
    }
  }

  getDisplayUrl(siteurl: string): SafeHtml {
    try {
      const decodedUrl = decodeURIComponent(siteurl);
      const sanitizedUrl = this.sanitizer.bypassSecurityTrustHtml(decodedUrl);
      return sanitizedUrl;
    } catch (error) {
      console.error('Invalid URL:', siteurl);
      return siteurl;
    }
  }

  addPassword(event: Event): void {
    event.preventDefault();
    this.dialog.open(AddPasswordDialogComponent, {
      width: '500px',
      height: '500px'
    });

  
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
