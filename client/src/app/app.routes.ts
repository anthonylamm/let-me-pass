import { Routes } from '@angular/router';
import { StartpageComponent } from './pages/start/startpage.component';
import { LoginComponent } from './pages/loginpage/login.component';
import { SignupComponent } from './pages/loginpage/signup.component';
import { ResetPasswordComponent } from './pages/loginpage/components/reset-password.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PasswordViewComponent } from './pages/dashboard/password-view.component';
export const routes: Routes = [
  // Root route displays StartpageComponent
  { path: '', component: StartpageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {path: 'reset-password', component: ResetPasswordComponent},
  { path: 'dashboard', component: DashboardComponent },
  { path: 'dashboard/:sitename', component: PasswordViewComponent},
  { path: '**', redirectTo: '' },


];


