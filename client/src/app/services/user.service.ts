import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environment/environment'; // Import the environment file

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private backendUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  addPassword(sitename: string, username: string, siteurl: string,  password: string, notes: string){
    return this.http.post(`${this.backendUrl}/user/add-password`, {sitename, username, siteurl, password, notes} )
  }
  
  getUserPassword(password_id: number){
    return this.http.post(`${this.backendUrl}/user/user-password`, {password_id} )
  }

  getUserInfo(){
    // Log the request
    console.log('Making request to:', `${this.backendUrl}/user/user-information`);
    return this.http.get(`${this.backendUrl}/user/user-information`);
  }
}