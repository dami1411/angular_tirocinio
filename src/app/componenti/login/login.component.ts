import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { FirebaseService } from 'src/app/servizi/firebase.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('loginform') loginFormTest!: NgForm;
  loginForm!: FormGroup;
  utenteLoggato!: { 
    idToken:string,
    expiresIn: string,
    expirationDate:Date
  }; 
  constructor(private authService:AuthService,private router: Router) {
    if(this.authService.isAuthenticated()) router.navigate(['/home']);
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
       email: new FormControl(null, [Validators.required,Validators.email]),
       password: new FormControl(null, [Validators.required,Validators.minLength(8)]),
    });
  }
  
  /*onSubmit(loginForm: NgForm){
    console.log(loginForm);
  }*/

  onSubmit(){
    const today= new Date().getTime();
    console.log(this.loginForm);
    this.authService.signIn({email: this.loginForm.value.email, password: this.loginForm.value.password, returnSecureToken: true})
    .subscribe((data:any)=>{
      const duration = Number(data.expiresIn);
        console.log(data);
        this.utenteLoggato = { 
          idToken : data.idToken,
          expiresIn: data.expiresIn,
          expirationDate: new Date( (today + duration)*1000) 
        };
        console.log(this.utenteLoggato.expirationDate);
        console.log(data.expiresIn+" --- "+Number.parseInt(data.expiresIn));
        sessionStorage.setItem('user',JSON.stringify(this.utenteLoggato));
        this.router.navigate(['./home']);      
        });
  }
}
