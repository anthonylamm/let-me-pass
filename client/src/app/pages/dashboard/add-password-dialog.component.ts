import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-password-dialog',
  templateUrl: './html/add-password-dialog.html',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatIconModule
  ],
  standalone: true, // Ensure this line is present
  styleUrls: ['./styles/add-password.scss'],
  encapsulation: ViewEncapsulation.None, // Ensure this line is appropriately set
})
export class AddPasswordDialogComponent {
  passwordForm: FormGroup;
  hidePassword: boolean = true; // For password visibility toggle

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddPasswordDialogComponent>,
    private userService: UserService,
    private snackBar: MatSnackBar,
  ) {
    this.passwordForm = this.fb.group({
      siteurl: ['', [Validators.required, Validators.pattern('https?://.+')]],
      username: ['', Validators.required],
      password: ['', Validators.required],
      notes: ['']
    });
  }

  onSubmit(): void {
    if (this.passwordForm.valid) {
      const { sitename, siteurl, username, password, notes } = this.passwordForm.value;
      this.userService.addPassword(sitename, username, siteurl, password, notes).subscribe({
        next: (response: any) => {
          this.snackBar.open(response.message, 'Close', {
            duration: 3000,
          });
          this.dialogRef.close(this.passwordForm.value);
        },
        error: (err) => {
          this.snackBar.open('Error adding password', 'Close', {
            duration: 3000,
          });
        }
      });
    }
  }
  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
  onCancel(): void {
    this.dialogRef.close();
  }
}
