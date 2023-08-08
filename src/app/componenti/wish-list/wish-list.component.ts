import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Prodotti } from 'src/app/modelli/prodotti.model';
import { WishList } from 'src/app/modelli/wish-list.model';
import { FirebaseProductsService } from 'src/app/servizi/firebase-products.service';
import { FirebaseService } from 'src/app/servizi/firebase.service';
import { WishListServiceService } from 'src/app/servizi/wish-list-service.service';

@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.css']
})
export class WishListComponent implements OnInit{
  like!:boolean;
  wishList:WishList[] = []
  products:Prodotti[] = []
  constructor(private wishListService:WishListServiceService,firebase:FirebaseService,private prodService:FirebaseProductsService,private authService: AuthService){}
  
  ngOnInit(): void {
    this.authService.checkSession();
    this.getWishListProds();
    
    
  }
  
  getProdsOfUser(keyProdUser:string[]) {
    this.prodService.getProdotti().subscribe((data:any) => {
      for(let keyUser of keyProdUser){
      
        data[keyUser].id = keyUser;
        this.products.push({id: data[keyUser].id, title: data[keyUser].title,description: data[keyUser].description, imgSrc: data[keyUser].imgSrc, price: data[keyUser].price})
      }  
    });
   }
   getWishListProds(){
    
    this.wishListService.getProdottiWishList().subscribe((data:any)=> {
      Object.keys(data).map((key) => {
        this.wishList.push({id:key,email:data[key].email,productKey:data[key].productKey});
      })
      
      let userProdKeys =this.getUserProdKey(JSON.parse(sessionStorage.getItem('user') || '{}').email,this.wishList);
      this.getProdsOfUser(userProdKeys);
      //this.products = [];
      
      //console.log(this.products);
    });
   
  }

  getUserProdKey(email:string,wishList:WishList[]):string[] {
    let prodUser = wishList.filter((item) => {
      return  item.email === email;
    });
    let prodkeyUser:string[] = [];
    prodUser.map((item)=> {
       prodkeyUser.push(item.productKey)
    })
    return prodkeyUser;
  }
  eventLikeHandler(res:any){
    let index = this.products.indexOf(res);
    if(index > -1)
      this.products.splice(index,1);
  } 
}