import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment'; // Import the environment file
// Define the structure of the login response
interface LoginResponse {
  success: boolean;
  token?: string;
  salt?: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private backendUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }
  /**
   * User login
   * @param username - User's username
   * @param password - User's password (used as master password)
   * @returns Observable of LoginResponse
   */
  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.backendUrl}/public/login`, { username, password });
  }
  setToken(token: string): void {
    localStorage.setItem('token', token); // Use sessionStorage for session-based storage
  }
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  /**
   * User signup
   * @param username - Desired username
   * @param email - User's email address
   * @param password - User's password (used as master password)
   * @returns Observable of the signup result
   */
  signup(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.backendUrl}/public/register`, { username, email, password });
  }
  resetPassword(email: string){
    return this.http.post(`${this.backendUrl}/reset/request-password-reset`, {email});
  }
  confirmResetPassword(token: string, password: string){
    return this.http.post(`${this.backendUrl}/reset/reset-password`, {token, password});
  }
  verifyEmail(token: string){
    return this.http.get(`${this.backendUrl}/public/verify-email`, { params: { token } });
  }

}