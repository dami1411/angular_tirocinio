import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router, RouterLinkActive, UrlSegment } from '@angular/router';
import { Prodotti } from 'src/app/modelli/prodotti.model';
import { FirebaseProductsService } from 'src/app/servizi/firebase-products.service';
import { FirebaseService } from 'src/app/servizi/firebase.service';
import { WishListServiceService } from 'src/app/servizi/wish-list-service.service';

@Component({
  selector: 'app-poduct',
  templateUrl: './poduct.component.html',
  styleUrls: ['./poduct.component.css']
})
export class PoductComponent implements OnInit {
 @Input() prodotto!: Prodotti;
 @Output() productLikeClick:EventEmitter<any> = new EventEmitter<any>();
 //detailClick!:Prodotti
 like!:boolean;
 pathToDetailFromWishList = '.';
 constructor(private firebase:FirebaseService, private wishListService:WishListServiceService , private httpService:HttpClient,private prodService:FirebaseProductsService,private route:ActivatedRoute,private router:Router){}
  
 ngOnInit(): void {
       
  //console.log("siamo in wishlit: "+this.route.snapshot.routeConfig?.path?.toLowerCase() == 'wishList'.toLowerCase());
  //controlla quale prodotto piace all'utente  
  this.wishListService.checkIfLikeIsPresent(this.prodotto,JSON.parse(sessionStorage.getItem('user') || '{}').email).
    subscribe((likeValue) => {
      this.like = likeValue;
    })
  }
 
 /*onClickLike(product:Prodotti, event: MouseEvent){
  let userEmail = (JSON.parse(sessionStorage.getItem('user') || '{}').email);
    let productKey = product.id;
    this.wishListService.checkIfLikeIsPresent(product,userEmail).subscribe((data) => {
      this.like = data;
       if(data === false)
          this.wishListService.insertProductWishList(JSON.parse(sessionStorage.getItem('user') || '{}').idToken,{
          email: userEmail,
          productKey: productKey
        }).subscribe( (data) => {
          console.log(data);
          this.like = true;
        })
       if(data === true)
        this.wishListService.getPrimaryKey(product,userEmail).subscribe((primaryKey:any) => {
             console.log(primaryKey);
          this.wishListService.deleteProdottoWishList(primaryKey).subscribe((data:any)=>{
            console.log(data);
            this.like = false;
          });
        })
          
    })
    
 }*/
 onClickLike(product:Prodotti) {
   let likeProd = this.like;
   this.wishListService.onClickLike(product,likeProd).subscribe((likeVal) => {
    this.like = likeVal;
    this.wishListService.getProdottiWishList()
    this.productLikeClick.emit(product);
    /*this.wishListService.getProdottiWishList().subscribe((data) => {
      console.log(data);
    });*/
    
   })
   
   
 }

 /*onClickProd(title:string){
  //console.log(this.prodotti);
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
}*/
 /*onClickDetail(product:Prodotti) {
  let products : Prodotti[] = [];
  let prod:Prodotti| undefined; 
  this.prodService.getProdotti().subscribe((data:any) => {
    Object.keys(data).map((key) => {
      products.push({id:key,title: data[key].title, description: data[key].description, imgSrc:data[key].imgSrc,price: data[key].price});
    })
    prod = products.find((element) => {
      return element.title === product.title
    })
       
  })
   
 }*/
 onClickTitle(product:Prodotti){
  this.router.navigate(['/home/'+product.title]);
 }
}
