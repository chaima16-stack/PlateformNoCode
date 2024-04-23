import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { DesignComponent } from './design/design.component';
import {CdkDrag} from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { ApplicationComponent } from './application/application.component';
import { ScreenComponent } from './screen/screen.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DesignComponent,
    ApplicationComponent,
    ScreenComponent
   
  ],
  imports: [
    FormsModule,
    BrowserModule,
    CdkDrag,
    AppRoutingModule,
    HttpClientModule,
    

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
