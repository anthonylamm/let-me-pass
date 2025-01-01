import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button'; // Added import
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { PasswordGeneratorService } from '../../services/passwordgenerator.service'; // Import the service



@Component({
  selector: 'app-password-generator',
  templateUrl: './html/password-generator.html',
  styleUrls: ['./styles/password-generator.scss'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatCheckboxModule,
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  
})
export class PasswordGeneratorComponent {
  passwordForm: FormGroup;
  generatedPassword: string = '';

  constructor(
    private fb: FormBuilder,
    private passwordGeneratorService: PasswordGeneratorService, // Inject the service
    

  ) {
    this.passwordForm = this.fb.group({
      length: [12],
      includeUppercase: [true],
      includeLowercase: [true],
      includeNumbers: [true],
      includeSpecialChars: [false]
    });
  }
  generatePassword(): void {
    if (this.passwordForm.invalid) {
      // Optionally, display an error message
      console.error('Form is invalid');
      return;
    }

    const { length, includeUppercase, includeLowercase, includeNumbers, includeSpecialChars } = this.passwordForm.value;

    try {
      this.generatedPassword = this.passwordGeneratorService.generatePassword(
        length,
        includeNumbers,
        includeSpecialChars,
        includeUppercase,
        includeLowercase
      );
    } catch (error) {
      console.error('Password generation error:', error);
      // Optionally, display an error message to the user
    }
  }
  copyToClipboard(): void {
    if (this.generatedPassword) {
      navigator.clipboard.writeText(this.generatedPassword).then(() => {
        // Optionally, show a success message
        console.log('Password copied to clipboard.');
      }).catch(err => {
        // Optionally, handle the error
        console.error('Failed to copy password:', err);
      });
    }
  }
}

