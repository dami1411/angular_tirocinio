import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { FirebaseService } from 'src/app/servizi/firebase.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  logged = false;
  username!:string;
  constructor(private authService: AuthService, private router: Router,private firebase:FirebaseService) { }
  ngOnInit(): void {
    //this.logged = sessionStorage.getItem('user')!= undefined;
    this.logged = this.authService.isAuthenticated();
    this.username = JSON.parse(sessionStorage.getItem('user') || '{}').username;
    
    console.log(this.username);
  }
  onLogOut() {
    this.logged = false;
    this.username ='';
    this.authService.logOut();
  }
}
