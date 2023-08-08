import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/auth/auth.service';
import { Utenti } from 'src/app/modelli/utenti.model';
import { FirebaseService } from 'src/app/servizi/firebase.service';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  utenti: Utenti[] = [];
  dataSource = new MatTableDataSource([]);
  userForm!: FormGroup;
  //showForm = false;
  utente!: Utenti;
  editButton: any;
  role!: string;
  //username!: string;
  //type!:string
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
  adminActions = ['deleteAction','changeRole'];
  //displayColumns = ['id', 'username', 'email', 'password', 'editAction', 'deleteAction', 'role'];
  displayColumns = ['username', 'email', 'password','role','editAction'];
  utenteLoggato = JSON.parse(sessionStorage.getItem('user') || "{}");
  constructor(private firebase: FirebaseService, public dialogEdit: MatDialog, public dialogDelete: MatDialog, private authService: AuthService) { }

  ngOnInit(): void {

    //this.router.navigate(['/login']);
    //this.url = this.firebase.getUrl();
    this.dataSource.filterPredicate = function(record:Utenti, filter) {
      return record.username.toLowerCase().includes(filter.toLowerCase());
    }
    this.authService.checkSession();
    this.getUsers();
    this.firebase.getRoleByEmail(JSON.parse(sessionStorage.getItem('user') || '{}').email).subscribe((role) => {
      this.role = role;
      console.log(role);
    /*this.firebase.getUsernameByEmail(JSON.parse(sessionStorage.getItem('user') || '{}').email).subscribe((username) =>{
      this.username = username;
      console.log(username);
     
    })*/ 
      
      if (this.role === 'admin')
          for(let action of this.adminActions)
            this.displayColumns.push(action);  
    });
    this.userForm = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)])
    });

  }
  
  getUsers() {
    this.firebase.getUtenti().subscribe((data: any) => {
      Object.keys(data).map((key) => {
        data[key].id = key;
        this.utenti.push({ id: data[key].id, username: data[key].username, email: data[key].email, password: data[key].password, role: 'normal' });
        this.dataSource.data = Object.values(data);
      });          
    });
   }
  onClickDelete(user: Utenti,type:string) {
    this.openDialogDelete('500', '500', user, type );
    //this.url = this.firebase.getUrlForDelete();

  }

  openDialogDelete(enterAnimationDuration: string, exitAnimationDuration: string, user: Utenti, tipo:string) {
    this.dialogDelete.open(DeleteDialogComponent, {
      data: {utente:user, type:tipo},
      width: '400px',
      enterAnimationDuration,
      exitAnimationDuration
    }).afterClosed().subscribe(_ => {
      this.getUsers();
    });
  }
  openDialogEdit(enterAnimationDuration: string, exitAnimationDuration: string, user: Utenti, tipo: string): void {
    //this.type = tipo;
    this.dialogEdit.open(EditDialogComponent, {
      data: { utente: user, type: tipo },
      width: '400px',
      enterAnimationDuration,
      exitAnimationDuration,
    }).afterClosed().subscribe(_ => {
      this.getUsers();
    });
  }
  onClickEdit(user: Utenti, type: string) {
    //console.log(event);
    //console.log(this.tabella);
    //this.showInput!=this.showInput;
    //(<HTMLButtonElement>event.currentTarget).disabled = true;
    //console.log(event.currentTarget);
    this.openDialogEdit('500', '500', user, type);
    //this.showForm = true;
    this.userForm.get('username')?.setValue(user.username);
    this.userForm.get('email')?.setValue(user.email);
    this.userForm.get('password')?.setValue(user.password);
    this.utente = user;   
  }
  onClickAdd(user: Utenti, type: string) {
    this.openDialogEdit('500', '500', user, type);
  }
  onClickChangeRole(user:Utenti, type: string) {
    this.openDialogEdit('500','500', user, type);
  }
  onClickRow(row: any) {
    console.log(row);
  }
  onSubmitEdit() {
    //this.url= this.firebase.getUrlForDelete();
    this.firebase.editUtente(this.utente.id, {
      username: this.userForm.get('username')?.value,
      email: this.userForm.get('email')?.value,
      password: this.userForm.get('password')?.value,
      role: this.userForm.get('role')?.value
    }).subscribe((data) => {
      console.log(data);
    })
    //this.showForm = false;
  }
  
  applyFilter(event:Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase(); 
  }
}
