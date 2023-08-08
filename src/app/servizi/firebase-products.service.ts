import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseProductsService {

  constructor(private httpService:HttpClient,private firebase:FirebaseService) { }

  url = 'https://angularpractice-5650a-default-rtdb.firebaseio.com';

  insertProdotto(idToken: string, body: {}) {
    let url = this.url;
    console.log(url);
    url += this.firebase.addTableToUrl('prodotti');
    url += this.firebase.addAuthToUrl(idToken);
    console.log(url);
    console.log("body "+Object.keys(body));
    return this.httpService.post(url, body);
  }

  getProdotti() {
    let url = this.url;
    console.log(url);
    url += this.firebase.addTableToUrl('prodotti');
    url += this.firebase.addAuthToUrl(JSON.parse(sessionStorage.getItem('user') || '{}').idToken);
    console.log(url);
    return this.httpService.get(url);
  }
  
  deleteProdotto(id: string) {
    //this.setAuthUrl();
    console.log(this.url + "/" + id);
    let url = this.url;
    url += this.firebase.addTableToUrl('prodotti');
    url += this.firebase.addIdToUrl(id);
    url += this.firebase.addAuthToUrl();
    console.log(url);
    //return this.httpService.delete(`${this.url}/${id}.json?auth=${JSON.parse(sessionStorage.getItem('user') || "{}").idToken}`);
    return this.httpService.delete(url);
  }

  editProdotto(id: string, body: {}) {
    //return this.httpService.patch(`${this.url}/${id}.json?auth=${JSON.parse(sessionStorage.getItem('user') || "{}").idToken}`,body);
    let url = this.url;
    url += this.firebase.addTableToUrl('prodotti');
    url += this.firebase.addIdToUrl(id);
    url += this.firebase.addAuthToUrl();
    console.log(url);
    return this.httpService.patch(url, body);
  }
  
}

