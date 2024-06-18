import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth-service/auth.service';
import { AppCreationServiceService } from '../services/app-service/app-creation-service.service';
import { DesignServiceService } from '../services/design-service/design-service.service';
import { DatabaseServiceService } from '../services/database-service/database-service.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit{
  constructor(private router: Router,private authservice:AuthService,private appService: AppCreationServiceService,private dbservice:DatabaseServiceService, private designService:DesignServiceService){}
app:any;
idappselected:any
activeApp=''
nameApp:any
namedb:any
screens:any
olddbname:any
iddbselected:any
alertVisible: boolean = false;
alertMessage: string = '';
alerts:any
ngOnInit(): void {
  //liste des apps d'user connecté 
  let token = sessionStorage.getItem("loggedInUser");
  this.authservice.decodeToken(token).subscribe((response:any)=>{
  this.appService.getAppByUser(parseInt(response.user_id,10)).subscribe((response)=>{
    const appsArray = Array.isArray(response) ? response : [response];

        sessionStorage.setItem('app',appsArray[0].id_app)
        this.dbservice.getDataBase(appsArray[0].database).subscribe((response:any)=>{
          sessionStorage.setItem("dbconnected",response.name_db)
          sessionStorage.setItem("id_db",response.id)
        })
    
    this.activeApp= appsArray[0].name
    this.nameApp = appsArray[0].name
    this.idappselected = appsArray[0].id_app
    this.iddbselected = appsArray[0].database
   this.appService.getScreensByApp(appsArray[0].id_app).subscribe(response=>{
    const screensArray = Array.isArray(response) ? response : [response];
      this.screens = screensArray.map(screen => ({
        app: screen.app,
        date_creation: screen.date_creation,
        date_update: screen.date_update,
        id_screen: screen.id_screen,
        name_screen: screen.name_screen,
        type_screen: screen.type_screen,
   
      }));})
this.dbservice.getDataBase(appsArray[0].database).subscribe((data:any)=>{
  this.namedb= data.name_db
  this.olddbname =data.name_db
})


    this.app=appsArray.map(app=>({
      date_creation: app.date_creation,
      date_update: app.date_update,
      description: app.description,
      id_app: app.id_app,
      name_app: app.name,
      user: app.user,
      database:app.database,

    }))
    
  });
});

sessionStorage.setItem('settings','true')
}
selectApp(app:any){
this.idappselected= app.id_app;
this.activeApp = app.name_app
this.nameApp = app.name_app
this.iddbselected = app.database
this.dbservice.getDataBase(app.database).subscribe((data:any)=>{
  this.namedb= data.name_db
  this.olddbname= data.name_db
  sessionStorage.setItem("dbconnected",data.name_db)
  sessionStorage.setItem("id_db",data.id)
})
sessionStorage.setItem('app',app.id_app)
   this.appService.getScreensByApp(this.idappselected).subscribe(response=>{
    const screensArray = Array.isArray(response) ? response : [response];
      this.screens = screensArray.map(screen => ({
        app: screen.app,
        date_creation: screen.date_creation,
        date_update: screen.date_update,
        id_screen: screen.id_screen,
        name_screen: screen.name_screen,
        type_screen: screen.type_screen,
        showSubItems: false
      }));})
   

}
updateScreen(screen:any,screenname:any){
  this.appService.updateScreenName(screen.id_screen, screenname,new Date()).subscribe()
  this.alertVisible = true; 

  this.alerts={type:"success",message:'Screen\'s name is updated successfully'}
}
updateAppName(){
this.appService.updateAppName(this.idappselected,this.nameApp,new Date()).subscribe((response:any)=>{
  this.activeApp=response.name
})
this.alertVisible = true; 

this.alerts={type:"success",message:'App\'s name is updated successfully'}
this.refreshListApp()
}
refreshListApp(){
  let token = sessionStorage.getItem("loggedInUser");
  this.authservice.decodeToken(token).subscribe((response:any)=>{
    this.appService.getAppByUser(parseInt(response.user_id,10)).subscribe((response)=>{
      const appsArray = Array.isArray(response) ? response : [response];
      this.app=appsArray.map(app=>({
        date_creation: app.date_creation,
        date_update: app.date_update,
        description: app.description,
        id_app: app.id_app,
        name_app: app.name,
        user: app.user,
        database:app.database,
     
      }))
    });
 
  })
}
updatedbName(){
this.dbservice.updatedbName(this.iddbselected,this.namedb,new Date()).subscribe()
this.dbservice.ModifyNamedb(this.olddbname,this.namedb).subscribe()
this.alertVisible = true; 

this.alerts={type:"success",message:'Database\'s name is updated successfully'}

}
deleteScreen(screen:any){
  this.appService.deleteScreen(screen.id_screen).subscribe((response) => {
    location.reload();
  }, )


}
SignOut(){
  sessionStorage.removeItem("loggedInUser")
  sessionStorage.removeItem("dbconnected")
  sessionStorage.removeItem('app')
  sessionStorage.removeItem('id_db')
  sessionStorage.setItem('loggedIn','false')
  this.authservice.SignOut();
}
closeAlert() {
  this.alertVisible = false; 

}
}
