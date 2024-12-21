import { Routes } from '@angular/router';
import { StartpageComponent } from './start/startpage.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

export const routes: Routes = [
  // Root route displays StartpageComponent
  { path: '', component: StartpageComponent },

  // You can add more routes later, for example:
   { path: 'login', component: LoginComponent },
   { path: 'signup', component: SignupComponent },
];
