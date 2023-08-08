import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FirebaseService } from 'src/app/servizi/firebase.service';
import { Inject } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { FirebaseProductsService } from 'src/app/servizi/firebase-products.service';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.css']
})
export class EditDialogComponent implements OnInit {
  userForm!: FormGroup;
  prodForm!: FormGroup;
  roles = ['guest','admin','no_user'];
  selectedRole!: any;
  constructor (private dialogRef: MatDialogRef<EditDialogComponent>, private firebase: FirebaseService,private prodService:FirebaseProductsService,@Inject(MAT_DIALOG_DATA) public data: any,private authService:AuthService) { }
  ngOnInit(): void {

    console.log(this.data);
    this.userForm = new FormGroup({
      username: new FormControl(this.data.utente.username, [Validators.required]),
      email: new FormControl(this.data.utente.email, [Validators.email, Validators.required]),
      password: new FormControl(this.data.utente.password, [Validators.required, Validators.minLength(8)]),
      role: new FormControl(this.roles[0],[Validators.required])
      //role: this.selectedRole
    });

    this.prodForm = new FormGroup({
      title: new FormControl(this.data.prodotto.title, [Validators.required]),
      description: new FormControl(this.data.prodotto.description, [Validators.required]),
      imgSrc: new FormControl(this.data.prodotto.imgSrc, [Validators.required, Validators.minLength(8)]),
      price: new FormControl(this.data.prodotto.price,[Validators.required]),
      //role: new FormControl(this.roles[0],[Validators.required])
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
    console.log(this.data);
    console.log(this.data.type.toLocaleLowerCase())
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
          this.dialogRef.close();
        })
      })
    }
    
    if(this.data.type.toLocaleLowerCase() === 'addProduct'.toLowerCase()) {
      this.prodService.insertProdotto(JSON.parse(sessionStorage.getItem('user') || '{}').idToken,{
        title: this.prodForm.get('title')?.value, 
        description: this.prodForm.get('description')?.value,
        imgSrc: this.prodForm.get('imgSrc')?.value,
        price: this.prodForm.get('price')?.value
      }).subscribe((data) => {
         console.log(data);
         this.dialogRef.close();
      } )
    }

    if(this.data.type.toLocaleLowerCase() === 'editProduct'.toLowerCase()) {
      console.log(this.data.product);
      this.prodService.editProdotto(this.data.prodotto.id,{
        title: this.prodForm.get('title')?.value,
        description: this.prodForm.get('description')?.value,
        imgSrc: this.prodForm.get('imgSrc')?.value,
        price: this.prodForm.get('price')?.value
      }).subscribe((data) => {
        console.log(data);
        this.dialogRef.close(EditDialogComponent);
        console.log("close dialog from edit component");
      })
    }
      
  }
  
}

