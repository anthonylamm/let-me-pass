import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { PasswordService } from '../../services/password.service';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddPasswordDialogComponent } from './add-password-dialog.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { decode } from 'html-entities';
import { CryptoService } from '../../services/crypto.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  templateUrl: './html/dashboard.html',
  standalone: true,
  styleUrls: ['./styles/dashboard.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    
  ]
})
export class DashboardComponent implements OnInit {
  passwordForm: FormGroup;
  displayedColumns: string[] = ['icon', 'siteurl', 'navigate'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>(); // Changed to MatTableDataSource

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private passwordService: PasswordService,
    private cryptoService: CryptoService,
    private snackBar: MatSnackBar
    
    
  ) {
    this.passwordForm = this.fb.group({
      siteurl: [''],
      notes: [''],
    });

    // Customize filter predicate to include 'sitename' and 'siteurl'
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const dataStr = `${data.sitename} ${data.siteurl}`.toLowerCase();
      return dataStr.includes(filter);
    };
  }

  ngOnInit(): void {
    this.displayUserInfo();
  }

  async displayUserInfo() {
    try {
      const token = localStorage.getItem('token');

      // Check if the token exists
      if (token) {
        const response: any = await firstValueFrom(this.userService.getUserInfo());
        this.dataSource.data = response.results; // Assign data to MatTableDataSource
      } else {
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

      return faviconUrl;
    } catch (error) {
      console.error('Invalid URL:', siteurl);
      return 'assets/default-favicon.ico';
    }
  }

  getDisplayUrl(siteurl: string): SafeHtml {
    try {
      const decodedUrl = decodeURIComponent(siteurl);
      return decodedUrl;
    } catch (error) {
      console.error('Invalid URL:', siteurl);
      return siteurl;
    }
  }

  addPassword(event: Event): void {
    event.preventDefault();
    this.dialog.open(AddPasswordDialogComponent, {
      width: '600px',
      height: '600px',

    });

  
  }
  onRowClicked(row: any): void {
    try {
        const siteUrl = row.siteurl.startsWith('http') ? row.siteurl : `https://${row.siteurl}`;
        const url = new URL(siteUrl);
        let hostname = url.hostname; // e.g., 'www.facebook.com'

        // removes 'www.' prefix if present
        if (hostname.startsWith('www.')) {
            hostname = hostname.substring(4);
        }
        this.passwordService.setSelectedPasswordData(row);
        // Navigate to '/dashboard/sitename/
        this.router.navigate(['/dashboard', hostname]);
    } catch (error) {
        console.error('Invalid URL:', row.siteurl);
    }
}


applyFilter(filterValue: string): void {
  const trimmedValue = filterValue.trim().toLowerCase(); // Remove whitespace and convert to lowercase
  this.dataSource.filter = trimmedValue;

  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}
  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
