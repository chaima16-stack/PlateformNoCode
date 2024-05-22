import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth-service/auth.service';
import { AppCreationServiceService } from '../services/app-service/app-creation-service.service';
import { DesignServiceService } from '../services/design-service/design-service.service';
import { DatabaseServiceService } from '../services/database-service/database-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  app:any;
  constructor(private router: Router,private authservice:AuthService,private appService: AppCreationServiceService,private dbservice:DatabaseServiceService, private designService:DesignServiceService){}
 
  ngOnInit(): void {
    //liste des apps d'user connecté 
    sessionStorage.removeItem('settings')
    sessionStorage.removeItem("dbconnected")
  sessionStorage.removeItem('app')
  sessionStorage.removeItem('id_db')
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
        showSubItems: false
      }))
    });
  });
  
  
  }
  openApp(app: any) {
    this.designService.activeApp = app.name_app;
    sessionStorage.setItem('app',app.id_app)
    this.dbservice.getDataBase(app.database).subscribe((response:any)=>{
      sessionStorage.setItem("dbconnected",response.name_db)
      sessionStorage.setItem("id_db",response.id)
    })
    this.designService.getScreenByApp()
    this.dbservice.refresTables()
    this.designService.buttons=[]
    this.designService.inputs=[]
    this.designService.texts=[]
    this.designService.icons=[]
    this.designService.lists=[]
    this.designService.listItem=[]
    this.designService.activeLink = 'design'; 

    this.router.navigate(['/Design']);
  }
  SignOut(){
    sessionStorage.removeItem("loggedInUser")
    sessionStorage.removeItem("dbconnected")
    sessionStorage.removeItem('app')
    sessionStorage.removeItem('id_db')
    sessionStorage.setItem('loggedIn','false')
    this.authservice.SignOut();
  }
  deleteApp(id:any){
    this.appService.deleteApp(id).subscribe((response) => {
      location.reload();
    }, )
   
  }
}
