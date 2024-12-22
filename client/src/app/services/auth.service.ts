import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment/environment'; // Import the environment file


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private backendUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }
  
  login(username: string, password: string){
    return this.http.post(`${this.backendUrl}/public/login`, {username, password});
  }
  setToken(token: string): void {
    localStorage.setItem('authToken', token); // Use sessionStorage for session-based storage
  }
  signup(username: string, email: string, password: string){
    return this.http.post(`${this.backendUrl}/public/register`, {username, email, password});
  }
  resetPassword(email: string){
    return this.http.post(`${this.backendUrl}/reset/request-password-reset`, {email});
  }

}
