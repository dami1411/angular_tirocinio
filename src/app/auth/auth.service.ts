import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { FirebaseService } from '../servizi/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //isLoggedIn = false;
  //isAdmin = false;
  signUpUrl='https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDAa9tfJ0dFbpvJdEtFBoajaRw3eu61hPE';
  signInUrl='https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDAa9tfJ0dFbpvJdEtFBoajaRw3eu61hPE';  
  constructor(private httpService:HttpClient,private router:Router,private firebase:FirebaseService) { }
  
  isAuthenticated(){
    //return this.isLoggedIn;
    return sessionStorage.getItem('user')!=undefined;
  }

  isRoleAdmin():Observable<boolean>{
    //return this.isAdmin;
    //return sessionStorage.getItem('user')!=null;
    //let isAdmin = false;
    return this.firebase.getRoleByEmail(JSON.parse(sessionStorage.getItem('user') || '{}').email)
    .pipe( map((role):boolean => {  return role === 'admin'}))
    
     
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
    if(sessionStorage.getItem('user') === '{}' || new Date() > new Date(JSON.parse(sessionStorage.getItem('user') || '{}').expirationDate) ) {
        console.log("token scaduto");
        this.logOut();
    }
  }
}
