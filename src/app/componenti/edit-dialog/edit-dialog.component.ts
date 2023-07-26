import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FirebaseService } from 'src/app/servizi/firebase.service';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.css']
})
export class EditDialogComponent implements OnInit {
  userForm!:FormGroup;
  constructor(private firebase:FirebaseService,@Inject(MAT_DIALOG_DATA)public data:any){}
  ngOnInit(): void {
    this.userForm = new FormGroup({
      username: new FormControl(this.data.username,[Validators.required]),
      email: new FormControl(this.data.email,[Validators.email,Validators.required]),
      password: new FormControl(this.data.password,[Validators.required,Validators.minLength(8)])
    });
  }
  onSubmitEdit(){
    this.firebase.editUtente(this.data.id,
      {
        username: this.userForm.get('username')?.value,
        email: this.userForm.get('email')?.value,
        password: this.userForm.get('password')?.value
      }
    ).subscribe((data)=>{
      console.log(data);
    });
  }
}

