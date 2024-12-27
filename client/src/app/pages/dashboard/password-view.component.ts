import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-password-view',
  templateUrl: './html/password-view.html',
  styleUrls: ['./html/password-view.scss'],
  imports: [
    MatCardModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ]
})


export class PasswordViewComponent {
  passwordForm: FormGroup = new FormGroup({});
  constructor(
    private router: Router
  ){

  }
  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
