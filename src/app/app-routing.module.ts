import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DesignComponent } from './design/design.component';
import { ApplicationComponent } from './application/application.component';
import { ScreenComponent } from './screen/screen.component';
import { DatabasesComponent } from './databases/databases.component';
import { AuthentificationComponent } from './authentification/authentification.component';
import { LoginGuard } from './authentification/login.guard';
import { AuthGuard } from './authentification/auth.guard';
import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';
import { WorkflowComponent } from './workflow/workflow.component';


const routes: Routes = [
  {path:'Design', component:DesignComponent, canActivate: [AuthGuard]},
  {path:'Application', component:ApplicationComponent, canActivate: [AuthGuard]},
  {path:'Screen/:number_screen', component:ScreenComponent, canActivate: [AuthGuard]},
  {path:'Databases', component:DatabasesComponent, canActivate: [AuthGuard]},
  {path:'Home', component:HomeComponent, canActivate: [AuthGuard]},
  {path:'Settings', component:SettingsComponent, canActivate: [AuthGuard]},
  {path:'Workflow', component:WorkflowComponent, canActivate: [AuthGuard]},
  {path: 'preview', loadChildren: () => import('./preview/preview.module').then(m => m.PreviewModule),canActivate: [AuthGuard] },
  {path:'LogIn', component:AuthentificationComponent,canActivate: [LoginGuard]},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
