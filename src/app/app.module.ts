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
import { DatabasesComponent } from './databases/databases.component';
import { AuthentificationComponent } from './authentification/authentification.component';
import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';
import { WorkflowComponent } from './workflow/workflow.component';
import { PreviewModule } from './preview/preview.module';





@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DesignComponent,
    ApplicationComponent,
    ScreenComponent,
    DatabasesComponent,
    AuthentificationComponent,
    HomeComponent,
    SettingsComponent,
    WorkflowComponent,
    



   
   
  ],
  imports: [
    FormsModule,
    BrowserModule,
    CdkDrag,
    AppRoutingModule,
    HttpClientModule,
    PreviewModule,


    

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
