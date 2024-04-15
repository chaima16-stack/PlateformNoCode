import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DesignComponent } from './design/design.component';
import { ApplicationComponent } from './application/application.component';
import { ScreenComponent } from './screen/screen.component';

const routes: Routes = [
  {path:'Design/:id_app', component:DesignComponent},
  {path:'Application', component:ApplicationComponent},
  {path:'Screen/:id_app/:number_screen', component:ScreenComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
