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
import { HttpErrorResponse } from '@angular/common/http'; // Import HttpErrorResponse

@Component({
  selector: 'app-dashboard',
  templateUrl: './html/dashboard.html',
  standalone: true,
  styleUrl: './html/dashboard.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class DashboardComponent implements OnInit {
  passwordForm: FormGroup;
  displayedColumns: string[] = ['sitename', 'siteurl'];
  dataSource: any[] = [];

  constructor(private fb: FormBuilder, private userService: UserService) {
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
        // Handle the absence of the token as needed
      }
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        console.error('Unauthorized access - possibly invalid token:', error.message);
        // Handle unauthorized access, e.g., redirect to login
      } else {
        console.error('Error fetching user info:', error);
      }
    }
  }

  addPassword(): void {
    if (this.passwordForm.valid) {
      const newPassword = this.passwordForm.value;
      console.log('New Password:', newPassword);
      // Add logic to handle the new password
    }
  }
}
