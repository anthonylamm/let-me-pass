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
    
    return this.http.get(`${this.backendUrl}/user/user-information`);
  }

  deleteUserPassword(password_id: number){
    return this.http.delete(`${this.backendUrl}/user/delete-password`, { body: { password_id } })
  }

  modifyUserLogin(
    password_id: number,
    sitename: string, 
    username: string, 
    siteurl: string,  
    password: string, 
    notes: string
  ){
    return this.http.put(`${this.backendUrl}/user/modify-data`, {password_id, sitename, username, siteurl, password, notes} )
  }
}