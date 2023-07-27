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
    idToken: string,
    expiresIn: string,
    expirationDate: Date,
    email: string,
    username?: string,
  
  };
  role!:string;
  //username!:string;
  constructor(private authService: AuthService, private router: Router, private firebase: FirebaseService) {
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

  onSubmit() {
    const today = new Date().getTime() / 1000;
    console.log(this.loginForm);
    this.authService.signIn({ email: this.loginForm.value.email, password: this.loginForm.value.password, returnSecureToken: true })
      .subscribe((data: any) => {
        const duration = Number(data.expiresIn);
        console.log(data);
        //this.getRoleByEmail(this.loginForm.value.email);
        console.log(this.loginForm.value.email, sessionStorage.getItem('usee'));
      
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
        });
        this.firebase.getRoleByEmail(this.loginForm.value.email).subscribe((role) => {this.role = role});
        
        this.router.navigate(['./home']);

      });
  }
}
