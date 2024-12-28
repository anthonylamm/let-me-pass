import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { decode } from 'html-entities';

@Component({
  selector: 'app-modify-password',
  templateUrl: './html/modify-password.html',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSnackBarModule
  ]
})
export class ModifyPassword {
  modifyForm: FormGroup;
 

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ModifyPassword>,
    private userService: UserService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any // Receiving the passed data

  ) {
    this.modifyForm = this.fb.group({
      username: [data.username, Validators.required],
      siteurl: [decode(data.siteurl), [Validators.required, Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w .-]*)*/?')]],
      sitename: [data.sitename, Validators.required],
      password: [data.encryptedpassword, Validators.required],
      notes: [data.notes]
    });
  }

  onSave(): void {
    if (this.modifyForm.valid) {
      const updatedData = {
        ...this.data, // Include existing data like password_id
        ...this.modifyForm.value
    }

    this.userService.modifyUserLogin(
      updatedData.password_id, 
      updatedData.sitename, 
      updatedData.username, 
      updatedData.siteurl,
      updatedData.password,
      updatedData.notes,
      ).subscribe({
        next: (response: any) => {
          this.snackBar.open(response.message, 'Close', {
            duration: 3000,
          });
          this.dialogRef.close(this.modifyForm.value);
        },
        error: (err) => {
          this.snackBar.open('Error adding password', 'Close', {
            duration: 3000,
          });
        }
      })
    console.log('Updated Password Data:', updatedData);
    this.data = null
  }
  }

  onCancel(): void {
    this.dialogRef.close();
    console.log(this.data.username)
  }
}
