import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <router-outlet></router-outlet>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
    }

    router-outlet {
      flex: 1;
      display: flex;
      flex-direction: column; /* Ensure child components stack vertically */
    }
  `],
})
export class AppComponent {}
