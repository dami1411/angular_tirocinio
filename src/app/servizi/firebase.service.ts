import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private httpService: HttpClient) { }
  url = 'https://angularpractice-5650a-default-rtdb.firebaseio.com';
  //authToken!:string;
  //urlForDelete = 'https://angularpractice-5650a-default-rtdb.firebaseio.com/utenti';
  /*getUrl(){
    return this.url;
  }*/

  addTableToUrl(tabella: string) {
    return `/${tabella}`;
  }

  addAuthToUrl(token: string = '') {
    let idToken = token || JSON.parse(sessionStorage.getItem('user') || '{}').idToken
    return `.json?auth=${idToken}`;
  }

  addIdToUrl(id: string) {
    return `/${id}`;
  }
  /*getAuthToken(authToken:string){
      return this.authToken = authToken;
  }*/
  /*getUrlForDelete() {
    return this.urlForDelete;
  }*/
  addOrderBy(field:string) {
    return `&orderBy="${field}"`
  }

  addEqualTo(value:string) {
    return `&equalTo="${value}"`
  }

  insertUtente(idToken: string, body: {}) {
    let url = this.url;
    console.log(url);
    url += this.addTableToUrl('utenti');
    url += this.addAuthToUrl(idToken);
    return this.httpService.post(url, body);
  }

  getUtenti() {
    let url = this.url;
    console.log(url);
    url += this.addTableToUrl('utenti');
    url += this.addAuthToUrl(JSON.parse(sessionStorage.getItem('user') || '{}').idToken);
    console.log(url);
    return this.httpService.get(url);
  }


  /*getRoleById(id:string): Observable<string> {
    return this.getUtenteByEmail().pipe(map((data:any)=>{
      return data.role || 'guest';
    }))
    
  }*/


  deleteUtente(id: string) {
    //this.setAuthUrl();
    console.log(this.url + "/" + id);
    let url = this.url;
    url += this.addTableToUrl('utenti');
    url += this.addIdToUrl(id);
    url += this.addAuthToUrl();
    console.log(url);
    //return this.httpService.delete(`${this.url}/${id}.json?auth=${JSON.parse(sessionStorage.getItem('user') || "{}").idToken}`);
    return this.httpService.delete(url);
  }

  editUtente(id: string, body: {}) {
    //return this.httpService.patch(`${this.url}/${id}.json?auth=${JSON.parse(sessionStorage.getItem('user') || "{}").idToken}`,body);
    let url = this.url;
    url += this.addTableToUrl('utenti');
    url += this.addIdToUrl(id);
    url += this.addAuthToUrl();
    console.log(url);
    return this.httpService.patch(url, body);
  }
  
  getRoleByEmail(email: any) : Observable<string> {
    return !!email ? this.getUserByEmail(email).pipe(map(user => user?.role || 'guest')) : of('no-user')
  }
  /*getRoleIsAdmin(email:any) {
    var subject = new Subject<boolean>();
    this.getRoleByEmail(email)
    .subscribe( (role) => {
      subject.next(role.toLowerCase() === 'admin');
    })
    return subject.asObservable();
  }*/
  getUsernameByEmail(email: any) : Observable<string> {
    return this.getUserByEmail(email).pipe(map(user => user.username));
  }
  getUserKeyByEmail(email:any) : Observable<string> {
    return this.getUserByEmail(email).pipe(map(user => user.id ))
  }
  getUserByEmail(email: string): Observable<any> {
    /*let url = this.url;
    url += this.addTableToUrl('utenti');
    url += this.addIdToUrl(id);
    url += this.addAuthToUrl();
    console.log(url);
    return this.httpService.get(url);*/
    return this.getUtenti().pipe(map((data: any) => {

      let id_user = Object.keys(data)
        .find(id => {
          return data[id].email === email
        });

      return id_user ? data[id_user] : undefined;

    }));

  }
}
