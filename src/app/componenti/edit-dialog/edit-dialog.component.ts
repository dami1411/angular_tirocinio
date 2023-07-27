import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FirebaseService } from 'src/app/servizi/firebase.service';
import { Inject } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.css']
})
export class EditDialogComponent implements OnInit {
  userForm!: FormGroup;
  roles = ['guest','admin','no_user'];
  selectedRole!: any;
  constructor(private firebase: FirebaseService, @Inject(MAT_DIALOG_DATA) public data: any,private authService:AuthService) { }
  ngOnInit(): void {
    console.log(this.data);
    this.userForm = new FormGroup({
      username: new FormControl(this.data.utente.username, [Validators.required]),
      email: new FormControl(this.data.utente.email, [Validators.email, Validators.required]),
      password: new FormControl(this.data.utente.password, [Validators.required, Validators.minLength(8)]),
      role: new FormControl(this.roles[0],[Validators.required])
      //role: this.selectedRole
    });
   
    if(this.data.type.toLowerCase() === 'changeRole'.toLowerCase()){
      this.userForm.get('username')?.disable();
      this.userForm.get('username')?.removeValidators([Validators.required]);
      this.userForm.get('email')?.disable();
      this.userForm.get('email')?.removeValidators([Validators.required]);
      this.userForm.get('password')?.disable();
      this.userForm.get('password')?.removeValidators([Validators.required]);
      console.log(" campi disabilitati");
    }
        
  }
  onSubmitEdit() {
    if (this.data.type.toLowerCase() === 'edit'.toLocaleLowerCase() || this.data.type.toLowerCase() === 'changeRole'.toLowerCase())
      this.firebase.editUtente(this.data.utente.id,
        {    
          username: this.userForm.get('username')?.value,
          email: this.userForm.get('email')?.value,
          password: this.userForm.get('password')?.value,
          //role: this.userForm.get('role')?.value
          role: this.userForm.get('role')?.value
        }
      ).subscribe((data) => {
        console.log(data);
      });
    if (this.data.type.toLowerCase() === 'add'.toLocaleLowerCase()) { 
      
      this.authService.signUp(
        {
          email: this.userForm.value.email,
          password: this.userForm.value.password,
          returnSecureToken: true
        }
      ).subscribe((data)=>{
        console.log(data);
        this.firebase.insertUtente(JSON.parse(sessionStorage.getItem('user') || '{}').idToken, {
          username: this.userForm.get('username')?.value,
          email: this.userForm.get('email')?.value,
          password: this.userForm.get('password')?.value
        }).subscribe((data) => {
          console.log(data);
        })
      })
      }
      
  }
  
}

