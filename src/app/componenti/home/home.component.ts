import { Dialog } from '@angular/cdk/dialog';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Utenti } from 'src/app/modelli/utenti.model';
import { FirebaseService } from 'src/app/servizi/firebase.service';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Prodotti } from 'src/app/modelli/prodotti.model';
import { FirebaseProductsService } from 'src/app/servizi/firebase-products.service';
import { WishListServiceService } from 'src/app/servizi/wish-list-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  //url!: string;
  //@ViewChild('tabella') tabella:any;

  //utenti: Utenti[] = [];
  prodotti: Prodotti[] = [];
  filteredProds:Prodotti[] = [];
  dataSource = new MatTableDataSource([]);
  //userForm!: FormGroup;
  //showForm = false;
  //utente!: Utenti;
  prodForm!: FormGroup;
  @Input()prodotto!:Prodotti;
  editButton: any;
  role: string = '';
  //username!: string;
  isDetail!:boolean;
  prodottoClckDetail!:Prodotti;
  like!:boolean;

  //adminActions = ['deleteAction','changeRole'];
  //displayColumns = ['id', 'username', 'email', 'password', 'editAction', 'deleteAction', 'role'];
  displayColumns = ['username', 'email', 'password','role','editAction'];
  utenteLoggato = JSON.parse(sessionStorage.getItem('user') || "{}");
  detailProd!:Prodotti

  constructor(private firebase: FirebaseService,private prodService:FirebaseProductsService, public dialogEdit: MatDialog, public dialogDelete: MatDialog, private authService: AuthService, private route: ActivatedRoute,private wishListService:WishListServiceService,private router:Router) {
    console.log("constructor");
   }
    
  /* controllare la sessione
     controllare il ruolo dell'utente appena loggato  
  */
  ngOnInit(): void {
    console.log("OnInit");
     this.authService.checkSession(); //dopo 1 ora dal login chiama il logOut
     
     //controllo del ruolo dell'utente appena loggato per far apparire o meno i pulsanti add edit e delete dei prodotti
     this.firebase.getRoleByEmail(JSON.parse(sessionStorage.getItem('user') || '{}').email).subscribe((role) => {
      this.role = role;
      console.log(role);
    });
    
    this.getProds();//stampare a video tutti i prodotti e riempe l'array prodotti
    //ottengo l'username per stamparlo 
    /*this.firebase.getUsernameByEmail(JSON.parse(sessionStorage.getItem('user') || '{}').email).subscribe((username) =>{
      this.username = username;
      console.log(username);
     
    })*/
     //this.like = this.wishListService.getLike();    
      
    //this.router.navigate(['/login']);
    //this.url = this.firebase.getUrl();
    /*this.dataSource.filterPredicate = function(record:Utenti, filter) {
      return record.username.toLowerCase().includes(filter.toLowerCase());
    }*/
    
    //getUsers();
    
    
    
      /*if (this.role === 'admin')
          for(let action of this.adminActions)
            this.displayColumns.push(action);*/  
    
    
    /*this.userForm = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)])
    });*/
    console.log(this.route.snapshot.paramMap.get('title'));
     this.isDetail = !this.route.snapshot.paramMap.get('title') ? false : true
     console.log(this.isDetail);
     if(this.isDetail) 
      this.onClickProd(this.route.snapshot.paramMap.get('title')!);
    
    

    this.prodForm = new FormGroup({
       title: new FormControl(null, [Validators.required]),
       email: new FormControl(null, [Validators.required]),
       imgSrc: new FormControl(null, [Validators.required]) 
    })

  }

  /*getUsers() {
    this.firebase.getUtenti().subscribe((data: any) => {
      Object.keys(data).map((key) => {
        data[key].id = key;
        this.utenti.push({ id: data[key].id, username: data[key].username, email: data[key].email, password: data[key].password, role: 'normal' });
        this.dataSource.data = Object.values(data);
      });          
    });
   }*/
   getProds() {
    console.log("chiamo get prodotti");
    this.prodService.getProdotti().subscribe((data:any) => {
      Object.keys(data).map((key) => {
        data[key].id = key;
        this.prodotti.push({id: data[key].id, title: data[key].title,description: data[key].description, imgSrc: data[key].imgSrc, price: data[key].price})
        this.filteredProds.push({id: data[key].id, title: data[key].title,description: data[key].description, imgSrc: data[key].imgSrc, price: data[key].price})   
      });
    });
   }

  onClickDelete(product: Prodotti) {
    this.openDialogDelete('500', '500', product,'prodotto');
    //this.url = this.firebase.getUrlForDelete();

  }

  openDialogDelete(enterAnimationDuration: string, exitAnimationDuration: string, product: Prodotti,tipo:string) {
    this.dialogDelete.open(DeleteDialogComponent, {
      data:{ prodotto:product, type: tipo},
      width: '400px',
      enterAnimationDuration,
      exitAnimationDuration
    }).afterClosed().subscribe(_ => {
      
      this.prodotti = [];
      this.filteredProds = [];
      this.getProds();
    });
  }

  openDialogEdit(enterAnimationDuration: string, exitAnimationDuration: string, user: Utenti,product: Prodotti ,tipo: string): void {
    //this.type = tipo;
    this.dialogEdit.open(EditDialogComponent, {
      data: { utente: user, prodotto:product,type: tipo },
      width: '400px',
      enterAnimationDuration,
      exitAnimationDuration,
    }).afterClosed().subscribe(_ => {
      console.log("chiusa");
      this.prodotti = [];
      this.filteredProds = [];
      this.getProds();
    });
  }
  onClickEdit(user: Utenti,product:Prodotti ,type: string) {
    //console.log(event);
    //console.log(this.tabella);
    //this.showInput!=this.showInput;
    //(<HTMLButtonElement>event.currentTarget).disabled = true;
    //console.log(event.currentTarget);
    this.openDialogEdit('500', '500', user,product,type);
    //this.showForm = true;
    this.prodForm.get('username')?.setValue(user.username);
    this.prodForm.get('email')?.setValue(user.email);
    this.prodForm.get('password')?.setValue(user.password);
    this.prodotto = product;   
  }

  onClickAdd(user: Utenti,product:Prodotti ,type: string) {
    this.openDialogEdit('500', '500', user,product,type);
  }

  onClickChangeRole(user:Utenti,product:Prodotti ,type: string) {
    this.openDialogEdit('500','500', user,product,type);
  }

  /*onClickRow(row: any) {
    console.log(row);
  }*/

  onSubmitEdit() {
    //this.url= this.firebase.getUrlForDelete();
    this.prodService.editProdotto(this.prodotto.id, {
      username: this.prodForm.get('title')?.value,
      email: this.prodForm.get('description')?.value,
      password: this.prodForm.get('imgSrc')?.value,
      //role: this.prodForm.get('role')?.value
    }).subscribe((data) => {
      console.log(data);
    })
    //this.showForm = false;
  }
  
  /*applyFilter(event:Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase(); 
  }*/
  /*onDetailClickHandler(data:any) {
      console.log("dati "+data);
  }*/
  //LIKKE
  onClickProd(title:string){
    console.log(this.prodotti);
    let products : Prodotti[] = [];
    let prod:Prodotti| undefined; 
   this.prodService.getProdotti().subscribe((data:any) => {
    Object.keys(data).map((key) => {
      products.push({id:key,title: data[key].title, description: data[key].description, imgSrc:data[key].imgSrc,price: data[key].price});
    })
    prod = products.find((element) => {
      return element.title === title
    })
    
    this.detailProd = prod!;
    this.wishListService.checkIfLikeIsPresent(this.detailProd,JSON.parse(sessionStorage.getItem('user') || '{}').email)
    .subscribe((data)=>{
      this.like = data;
    })   
  })
}

  
  onClickLike(product:Prodotti){
    let likeProd = this.like;
    this.wishListService.onClickLike(product,likeProd).subscribe((likeVal) => {
      this.like = likeVal;
      console.log("clicked "+ this.like);
    });
    //this.like = this.wishListService.getLike();    
  }
  goToHome(){
    this.router.navigate(['/home']);
  }

  filterProds(event:Event){
    
    const filterValue = (event.target as HTMLInputElement).value;
    let filteredProds = this.prodotti.filter((element) => {
      return element.title.toLowerCase().includes(filterValue.toLowerCase());
    })
    if(filteredProds) this.filteredProds = filteredProds;
    else this.filteredProds = this.prodotti;
  }
}
