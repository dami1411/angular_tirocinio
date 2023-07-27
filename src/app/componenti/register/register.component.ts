import { HttpEvent, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { FirebaseService } from 'src/app/servizi/firebase.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  url!: string;

  constructor(private firebase: FirebaseService, private authService: AuthService) {
    //this.url = this.firebase.setUrl();
  }



  registerForm!: FormGroup;
  ngOnInit(): void {
    this.registerForm = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.email, Validators.required]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)])
    });

  }

  onSubmit() {
    console.log(this.registerForm);

    this.authService.signUp(
      {
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        returnSecureToken: true
      })
      .subscribe((data: any) => {
        console.log(data);

        this.firebase.insertUtente(data.idToken, { username: this.registerForm.value.username, email: this.registerForm.value.email, password: this.registerForm.value.password, role: 'user' }).subscribe((data: any) => {
          console.log(data);
        });
      });

  }
}
