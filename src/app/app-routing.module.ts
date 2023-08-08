import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './componenti/home/home.component';
import { SideNavComponent } from './componenti/side-nav/side-nav.component';
import { LoginComponent } from './componenti/login/login.component';
import { RegisterComponent } from './componenti/register/register.component';
import { authGuard, authGuardChild } from './auth/auth.guard';
import { NotFoundComponent } from './componenti/not-found/not-found.component';
import { UserSettingsComponent } from './componenti/user-settings/user-settings.component';
import { UserManagementComponent } from './componenti/user-management/user-management.component';
import { CourtesyPageComponent } from './componenti/courtesy-page/courtesy-page.component';
import { WishListComponent } from './componenti/wish-list/wish-list.component';
import { PoductComponent } from './componenti/poduct/poduct.component';

const routes: Routes = [
  {path:'',component: SideNavComponent, canActivate:[authGuard], children:[
    {path:'', redirectTo: 'home',pathMatch:'full'},
    {path: 'home',component: HomeComponent},
    {path: 'home/:title',component: HomeComponent},
    {path:'user_settings', component:UserSettingsComponent},
    {path:'user_management',component:UserManagementComponent, canActivate:[authGuardChild]},
    {path:'courtesy_page',component:CourtesyPageComponent},
    {path:'wishList',component:WishListComponent}
  ]},
  {path:'login',component:LoginComponent},
  {path:'register',component:RegisterComponent},
  {path:'404',component:NotFoundComponent},
  {path: '**', redirectTo: '/404',pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
