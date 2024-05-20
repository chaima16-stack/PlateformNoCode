import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DesignComponent } from './design/design.component';
import { ApplicationComponent } from './application/application.component';
import { ScreenComponent } from './screen/screen.component';
import { DatabasesComponent } from './databases/databases.component';
import { AuthentificationComponent } from './authentification/authentification.component';
import { LoginGuard } from './authentification/login.guard';
import { AuthGuard } from './authentification/auth.guard';

const routes: Routes = [
  {path:'Design', component:DesignComponent, canActivate: [AuthGuard]},
  {path:'Application', component:ApplicationComponent, canActivate: [AuthGuard]},
  {path:'Screen/:number_screen', component:ScreenComponent, canActivate: [AuthGuard]},
  {path:'Databases', component:DatabasesComponent, canActivate: [AuthGuard]},
  {path:'LogIn', component:AuthentificationComponent,canActivate: [LoginGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
