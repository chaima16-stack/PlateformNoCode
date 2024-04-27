import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DesignComponent } from './design/design.component';
import { ApplicationComponent } from './application/application.component';
import { ScreenComponent } from './screen/screen.component';
import { DatabasesComponent } from './databases/databases.component';

const routes: Routes = [
  {path:'Design', component:DesignComponent},
  {path:'Application', component:ApplicationComponent},
  {path:'Screen/:id_app/:number_screen', component:ScreenComponent},
  {path:'Databases', component:DatabasesComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
