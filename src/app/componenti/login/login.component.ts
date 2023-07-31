import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { FirebaseService } from 'src/app/servizi/firebase.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('loginform') loginFormTest!: NgForm;
  loginForm!: FormGroup;
  durationInSeconds = 5;
  utenteLoggato!: {
    idToken: string,
    expiresIn: string,
    expirationDate: Date,
    email: string,
    username?: string,
  
  };
  role!:string;
  //username!:string;
  constructor(private authService: AuthService, private router: Router, private firebase: FirebaseService,private  _snackBar: MatSnackBar) {
    if (this.authService.isAuthenticated()) router.navigate(['/home']);
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
    });
  }

  /*onSubmit(loginForm: NgForm){
    console.log(loginForm);
  }*/
  /*getRoleByEmail(email: string) {
    this.firebase.getUtenti().subscribe((data: any) => {
      Object.keys(data).map((key) => {
        //console.log(if());
        console.log(data[key]);
        if (this.loginForm.value.email === data[key].email) {
          console.log("l'utente ha il ruolo: " + data[key].role);
          this.username = data[key].username;

        }
      });
    });
  }*/
  openSnackBar(message: string) {
    this._snackBar.open(message,'ok',{duration:this.durationInSeconds*1000});
  }
  onSubmit() {
    const today = new Date().getTime() / 1000;
    console.log(this.loginForm);
    this.authService.signIn({ email: this.loginForm.value.email, password: this.loginForm.value.password, returnSecureToken: true })
      .subscribe((data: any) => {
        const duration = Number(data.expiresIn);
        console.log(data);
        //this.getRoleByEmail(this.loginForm.value.email);
        console.log(this.loginForm.value.email, sessionStorage.getItem('user'));
      
        this.utenteLoggato = {
          idToken: data.idToken,
          expiresIn: data.expiresIn,
          expirationDate: new Date((today + duration) * 1000),
          email: this.loginForm.value.email
        };

        console.log(this.utenteLoggato.expirationDate);
        console.log(data.expiresIn + " --- " + Number.parseInt(data.expiresIn));

        sessionStorage.setItem('user', JSON.stringify(this.utenteLoggato));
        //this.getRoleByEmail(this.loginForm.value.email);
        this.firebase.getUsernameByEmail(this.loginForm.value.email).subscribe((username) =>{ 
          this.utenteLoggato = JSON.parse(sessionStorage.getItem('user') || '{}');
          this.utenteLoggato.username = username;
          sessionStorage.setItem('user', JSON.stringify(this.utenteLoggato));
        }, (error:any) => {console.log(error);});
        this.firebase.getRoleByEmail(this.loginForm.value.email).subscribe((role) => {this.role = role});
        
        this.router.navigate(['./home']);

      }, (error) =>{
        if(error.error.error.message === 'EMAIL_NOT_FOUND')
            this.openSnackBar('Email non registrata, perfavore prima registrati.');
        if(error.error.error.message === 'INVALID_PASSWORD')
          this.openSnackBar('Email o Password sbagliate, perfavore controllale e riprova.');
        if(error.error.error.message ===`TOO_MANY_ATTEMPTS_TRY_LATER 
        : Access to this account has been temporarily disabled 
        due to many failed login attempts. You can immediately restore it 
        by resetting your password or you can try again later.`)
        this.openSnackBar('troppi tentativi di accesso, pervafore attendi e riprova più tardi.');
          
      });
  }
}
