import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { HttpClient } from '@angular/common/http';
import { Prodotti } from '../modelli/prodotti.model';
import { Observable, find, map, of, switchMap } from 'rxjs';
import { WishList } from '../modelli/wish-list.model';

@Injectable({
  providedIn: 'root'
})
export class WishListServiceService {
  url = 'https://angularpractice-5650a-default-rtdb.firebaseio.com';
  //like!:boolean;
  constructor(private firebase:FirebaseService,private httpService:HttpClient) { }
 

  insertProductWishList(idToken: string, body: {}) {
    let url = this.url;
    console.log(url);
    url += this.firebase.addTableToUrl('wishList');
    url += this.firebase.addAuthToUrl(idToken);
    console.log(url);
    console.log("body "+Object.keys(body));
    return this.httpService.post(url, body);
  }

  getProdottiWishList() {
    let url = this.url;
    //console.log(url);
    url += this.firebase.addTableToUrl('wishList');
    url += this.firebase.addAuthToUrl(JSON.parse(sessionStorage.getItem('user') || '{}').idToken);
    console.log(url);
    return this.httpService.get(url);
  }
  getProdottiWishListByEmail(email:string) {
    let url =  this.url;
    url += this.firebase.addTableToUrl('wishList');
    url += this.firebase.addAuthToUrl(JSON.parse(sessionStorage.getItem('user') || '{}').idToken);
    url += this.firebase.addOrderBy('email');
    url += this.firebase.addEqualTo(email);
    console.log(url);
    return this.httpService.get(url);
  }
  
  checkIfLikeIsPresent(product:Prodotti,email:string):Observable<boolean> {
   let records:WishList[] = [];   
   return this.getProdottiWishList().pipe(map((data:any):boolean => {
      //console.log(data);
      Object.keys(data).map((key:any)=>{
        records.push({id:key,email: data[key].email,productKey: data[key].productKey});
      })
      let result = records.find((element) => { return element.email === email && element.productKey === product.id })  
      return result!=undefined
   }))
             
  }
  getPrimaryKey(product:Prodotti, email:string):Observable<string> {
    
    let records:WishList[] = []
    return this.getProdottiWishList().pipe(map((data:any):string => {
      Object.keys(data).map((key:any)=>{
        records.push({id:key,email: data[key].email,productKey: data[key].productKey});
      })
      let result = records.find((element) => {return element.email === email && element.productKey === product.id})
      if(result)
        return result.id;
      else return "no_id";
    }))
  }

  deleteProdottoWishList(id: string) {
    //this.setAuthUrl();
    console.log(this.url + "/" + id);
    let url = this.url;
    url += this.firebase.addTableToUrl('wishList');
    url += this.firebase.addIdToUrl(id);
    url += this.firebase.addAuthToUrl();
    console.log(url);
    //return this.httpService.delete(`${this.url}/${id}.json?auth=${JSON.parse(sessionStorage.getItem('user') || "{}").idToken}`);
    return this.httpService.delete(url);
  }

  editProdottoWishList(id: string, body: {}) {
    //return this.httpService.patch(`${this.url}/${id}.json?auth=${JSON.parse(sessionStorage.getItem('user') || "{}").idToken}`,body);
    let url = this.url;
    url += this.firebase.addTableToUrl('wishList');
    url += this.firebase.addIdToUrl(id);
    url += this.firebase.addAuthToUrl();
    console.log(url);
    return this.httpService.patch(url, body);
  }

  /*getLike():boolean{
    return this.like;
  }*/

  /*onClickLike(product:Prodotti,like:boolean):Observable<boolean>{
    let userEmail = (JSON.parse(sessionStorage.getItem('user') || '{}').email);
      let productKey = product.id;
      if(like === false) {
            this.insertProductWishList(JSON.parse(sessionStorage.getItem('user') || '{}').idToken,{
            email: userEmail,
            productKey: productKey
          }).subscribe((data:any) => {
            console.log(data);
           
          })
          return of(true)
        }
         if(like === true) {
          this.getPrimaryKey(product,userEmail).subscribe((primaryKey:any) => {
               console.log(primaryKey);
            this.deleteProdottoWishList(primaryKey).subscribe((data:any)=>{
              console.log(data);
             
            });
        })
        return of(false);
      }
      
      return of(false);   
      /*this.checkIfLikeIsPresent(product,userEmail).subscribe((data) => {
         like = data;
         
          })
            
      })*/

   /*   
   }*/
   onClickLike(product:Prodotti,like:boolean):Observable<boolean>{
    let userEmail = (JSON.parse(sessionStorage.getItem('user') || '{}').email);
      let productKey = product.id;
      if(like === false) {
            this.insertProductWishList(JSON.parse(sessionStorage.getItem('user') || '{}').idToken,{
            email: userEmail,
            productKey: productKey
          }).subscribe((data:any) => {
            console.log(data);
           
          })
          return of(true)
        }
         if(like === true) {
          this.getPrimaryKey(product,userEmail).pipe(switchMap((primaryKey:any) => {
               console.log(primaryKey);
            return this.deleteProdottoWishList(primaryKey)
        })).subscribe((data:any)=>{
          console.log(data);
         
        });
        return of(false);
      }
      
      return of(false);   
      /*this.checkIfLikeIsPresent(product,userEmail).subscribe((data) => {
         like = data;
         
          })
            
      })*/

      
   }
}


