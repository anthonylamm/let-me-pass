import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input'; // Added MatInputModule
import { MatButtonModule } from '@angular/material/button';
import { PasswordService } from '../../services/password.service';

@Component({
  selector: 'app-password-view',
  templateUrl: './html/password-view.html',
  standalone: true,
  styleUrls: ['./html/password-view.scss'],
  imports: [
    MatCardModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule // Included in imports
  ]
})
export class PasswordViewComponent implements OnInit {
  passwordData: any;
  passwordForm: FormGroup;
  hidePassword: boolean = true; // For password visibility toggle

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private passwordService: PasswordService
  ){
    // Initializing the form with necessary controls
    this.passwordForm = this.fb.group({
      username: [{ value: 'jacketforsales@gmail.com', disabled: true }],
      password: [{ value: '********', disabled: true }],
      siteurl: [{ value: 'aapxelearning.com', disabled: true }],
      sitename: [{ value: 'aapxelearning.com', disabled: true }],
      notes: [{ value: 'No note added', disabled: true }]
    });
  }

  
  ngOnInit(): void {
    this.passwordData = this.passwordService.getSelectedPasswordData();
    console.log( this.passwordData);

    if (!this.passwordData) {
      console.warn('No password data found. Redirecting to dashboard.');
      this.router.navigate(['/dashboard']);
    } else {
      console.log(this.passwordData);
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
  goback(): void{
    this.router.navigate(['/dashboard']);

  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}
