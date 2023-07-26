import { Dialog } from '@angular/cdk/dialog';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Utenti } from 'src/app/modelli/utenti.model';
import { FirebaseService } from 'src/app/servizi/firebase.service';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  //url!: string;
  //@ViewChild('tabella') tabella:any;

  utenti:Utenti[] = [];
  dataSource = new MatTableDataSource([]);
  userForm!:FormGroup;
  //showForm = false;
  utente!: Utenti;
  editButton:any;
  //showInput=false
  /*element_data : {position: number, name:string, weight: number, symbol:string}[] = [
    {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
    {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
    {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
    {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
    {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
    {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
    {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
    {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
    {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
    {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  ];*/
  displayColumns=['id','username','email','password','actions','deleteAction']; 
  utenteLoggato = JSON.parse(sessionStorage.getItem('user') || "{}");
  constructor(private firebase:FirebaseService,public dialogEdit:MatDialog, public dialogDelete:MatDialog,private authService:AuthService){}
  
  ngOnInit(): void {
     
    //this.router.navigate(['/login']);
    //this.url = this.firebase.getUrl();
    this.authService.checkSession();
    this.firebase.getUtenti( ).subscribe((data:any)=>{
        Object.keys(data).map((key)=> {
        data[key].id = key;   
        this.utenti.push({id:data[key].id,username:data[key].username,email:data[key].email,password:data[key].password});        
        this.dataSource.data = Object.values(data);
          
     })
      
   });
   this.userForm = new FormGroup({
    username : new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required]),
    password: new FormControl(null,[Validators.required,Validators.minLength(8)])
   });

  }
  onClickDelete(user:Utenti){
     this.openDialogDelete('500','500',user);
    //this.url = this.firebase.getUrlForDelete();
    
  }

  openDialogDelete(enterAnimationDuration:string,exitAnimationDuration:string,user:Utenti) {
    this.dialogDelete.open(DeleteDialogComponent, {
      data: user,
      width: '400px',
      enterAnimationDuration,
      exitAnimationDuration    
    });
  }
  openDialogEdit(enterAnimationDuration:string,exitAnimationDuration:string,user:Utenti):void{
    this.dialogEdit.open(EditDialogComponent,{
      data: user,
      width: '400px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }
  onClickEdit(user: Utenti,event:Event){
    //console.log(event);
    //console.log(this.tabella);
    //this.showInput!=this.showInput;
   //(<HTMLButtonElement>event.currentTarget).disabled = true;
    console.log(event.currentTarget);
    this.openDialogEdit('500','500',user);
    //this.showForm = true;
    this.userForm.get('username')?.setValue(user.username);
    this.userForm.get('email')?.setValue(user.email);
    this.userForm.get('password')?.setValue(user.password);
    this.utente = user;
  }
  onClickRow(row:any){
    console.log(row);
  }
  onSubmitEdit(){
      //this.url= this.firebase.getUrlForDelete();
      this.firebase.editUtente( this.utente.id, {
        username: this.userForm.get('username')?.value,
        email: this.userForm.get('email')?.value,
        password: this.userForm.get('password')?.value
      }).subscribe((data)=>{
        console.log(data);
      })
      //this.showForm = false;
  }
}
