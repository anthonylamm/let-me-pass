import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-startpage',
  standalone: true,
  imports: [MatButtonModule, RouterModule],
  template: `
    <header style="display: flex; gap: 1rem; padding: 1rem;">
      <button mat-raised-button color="primary" routerLink="/login">Login</button>
      <button mat-raised-button color="accent" routerLink="/signup">Signup</button>
    </header>
    <div style="padding: 1rem;">
      <h2>Welcome to the Start Page</h2>
    </div>
  `,
})
export class StartpageComponent {}
