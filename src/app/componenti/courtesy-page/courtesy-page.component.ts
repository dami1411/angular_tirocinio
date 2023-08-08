import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-courtesy-page',
  templateUrl: './courtesy-page.component.html',
  styleUrls: ['./courtesy-page.component.css']
})
export class CourtesyPageComponent {
  constructor(private authService:AuthService){}
  goToLogin(){
    this.authService.logOut();
  }
}
