import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //isLoggedIn = false;
  //isAdmin = false;
  signUpUrl='https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDAa9tfJ0dFbpvJdEtFBoajaRw3eu61hPE';
  signInUrl='https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDAa9tfJ0dFbpvJdEtFBoajaRw3eu61hPE';  
  constructor(private httpService:HttpClient,private router:Router) { }
  
  isAuthenticated(){
    //return this.isLoggedIn;
    return sessionStorage.getItem('user')!=undefined;
  }

  isRoleAdmin(){
    //return this.isAdmin;
    return sessionStorage.getItem('user')!=null;
  }
  signUp(body:{}){
    return this.httpService.post(this.signUpUrl, body);
  }
  signIn(body:{}) {
    return this.httpService.post(this.signInUrl, body);
  }
  
  logOut(){
    sessionStorage.removeItem('user');
    this.router.navigate(['/login']);
  } 
  checkSession(){
    if(sessionStorage.getItem('user') === '{}' || new Date() > JSON.parse(sessionStorage.getItem('user') || '{}').expirationDate ) {
        console.log("token scaduto");
        this.logOut();
    }
  }
}
