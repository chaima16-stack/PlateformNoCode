import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthentificationComponent } from './authentification/authentification.component';
import { CrudComponent } from './crud/crud.component';

const routes: Routes = [
  {path:'login', component:AuthentificationComponent},
  {path:'crud', component:CrudComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreviewRoutingModule { }
