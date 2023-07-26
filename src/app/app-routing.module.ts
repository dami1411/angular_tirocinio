import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './componenti/home/home.component';
import { SideNavComponent } from './componenti/side-nav/side-nav.component';
import { LoginComponent } from './componenti/login/login.component';
import { RegisterComponent } from './componenti/register/register.component';
import { authGuard, authGuardChild } from './auth/auth.guard';


const routes: Routes = [
  {path:'',component: SideNavComponent, canActivate:[authGuard], children:[
    {path:'', redirectTo: 'home',pathMatch:'full'},
    {path:'home', component:HomeComponent},
    
  ]},
  {path:'login',component:LoginComponent},
    {path:'register',component:RegisterComponent},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
