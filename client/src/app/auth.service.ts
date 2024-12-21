import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private backendUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }
  
  login(username: string, password: string){
    return this.http.post(`${this.backendUrl}/public/login`, {username, password});
  }
  setToken(token: string): void {
    localStorage.setItem('authToken', token); // Use sessionStorage for session-based storage
  }

}
