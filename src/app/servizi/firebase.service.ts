import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private httpService:HttpClient) { }
  url = 'https://angularpractice-5650a-default-rtdb.firebaseio.com';
  //authToken!:string;
  //urlForDelete = 'https://angularpractice-5650a-default-rtdb.firebaseio.com/utenti';
  /*getUrl(){
    return this.url;
  }*/

  addTableToUrl(tabella: string) {
    return `/${tabella}`;
  }
  
  addAuthToUrl(token: string = ''){
    let idToken = token || JSON.parse(sessionStorage.getItem('user') || '{}').idToken
    return `.json?auth=${idToken}`;
  }

  addIdToUrl(id:string) {
    return `/${id}`;
  }
  /*getAuthToken(authToken:string){
      return this.authToken = authToken;
  }*/
  /*getUrlForDelete() {
    return this.urlForDelete;
  }*/
  insertUtente(idToken:string, body:{}){
    let url = this.url;
    console.log(url);
    url += this.addTableToUrl('utenti');
    url += this.addAuthToUrl(idToken);
    return this.httpService.post(url,body);
  }

  getUtenti(){
      let url = this.url;
      console.log(url);
      url += this.addTableToUrl('utenti');
      url += this.addAuthToUrl();
      console.log(url);
      return this.httpService.get(url);
  }

  deleteUtente(id: string) {
    //this.setAuthUrl();
    console.log(this.url+"/"+id);
    let url = this.url;
    url += this.addTableToUrl('utenti');
    url += this.addIdToUrl(id);
    url += this.addAuthToUrl();
    console.log(url);
    //return this.httpService.delete(`${this.url}/${id}.json?auth=${JSON.parse(sessionStorage.getItem('user') || "{}").idToken}`);
    return this.httpService.delete(url);
  }
  
  editUtente(id:string, body: {}) {
    //return this.httpService.patch(`${this.url}/${id}.json?auth=${JSON.parse(sessionStorage.getItem('user') || "{}").idToken}`,body);
    let url = this.url;
    url += this.addTableToUrl('utenti');
    url += this.addIdToUrl(id);
    url += this.addAuthToUrl();
    console.log(url);
    return this.httpService.patch(url,body);
  } 
}
