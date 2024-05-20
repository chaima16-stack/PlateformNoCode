declare var google:any
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  router = inject(Router)
  private apiUrl = 'http://127.0.0.1:8000/';
  public loggedIn = false;
  public iduser:any;
  constructor(private http:HttpClient) { }

  SignOut(){
    google.accounts.id.disableAutoSelect();
    this.router.navigate(['/LogIn'])
  }
  authenticateWithGoogle(token: string) {
    
    const body= {
      token: token
    }
    return this.http.post(this.apiUrl+'login/', body);
  }
  isLoggedIn(): boolean {
    return this.loggedIn;
  }
  decodeToken(token:any){
    let params = new HttpParams().set('token', token)
  
    return this.http.get(this.apiUrl+'DecodeToken/', {params})
  }
 
}
