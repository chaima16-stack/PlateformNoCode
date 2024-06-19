import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PreviewRoutingModule } from './preview-routing.module';
import { AuthentificationComponent } from './authentification/authentification.component';
import { FormsModule } from '@angular/forms';
import { CrudComponent } from './crud/crud.component';


@NgModule({
  declarations: [
    AuthentificationComponent,
    CrudComponent
  ],
  imports: [
    CommonModule,
    PreviewRoutingModule,
    FormsModule
  ]
})
export class PreviewModule { }
