import { Component, OnInit } from '@angular/core';
import { AppCreationServiceService } from '../services/app-service/app-creation-service.service';
import { AuthService } from '../services/auth-service/auth.service';
import { DatabaseServiceService } from '../services/database-service/database-service.service';
import { DesignServiceService } from '../services/design-service/design-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  app:any

  isDropdownOpen: boolean = false; // Variable pour suivre l'état du dropdown
  isDropdownOpenSetting =false
constructor(private authservice:AuthService,private dbservice:DatabaseServiceService, public appService: AppCreationServiceService,public appCreationService: AppCreationServiceService,public designService:DesignServiceService){}
ngOnInit(): void {
  //liste des apps d'user connecté 
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
  setActiveLink(link: string): void {
    this.designService.activeLink = link; 
  }
 
  // Fonction pour définir l'application active
  setActiveApp(app: any) {
    this.designService.activeApp = app.name_app;
    sessionStorage.setItem('app',app.id_app)
    this.isDropdownOpen = false; // Fermer le dropdown après la sélection
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
   

  }
  toggleDropdownSetting() {
    this.isDropdownOpenSetting = !this.isDropdownOpenSetting;
  }
  // Fonction pour basculer l'état du dropdown
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Fermer le dropdown lorsqu'on clique en dehors de celui-ci
  closeDropdownOutsideClick(event: MouseEvent) {
    if (!(event.target as HTMLElement).closest('.dropdown')) {
      this.isDropdownOpen = false;
    }
  }
  SignOut(){
    sessionStorage.removeItem('settings')
    sessionStorage.removeItem("loggedInUser")
    sessionStorage.removeItem("dbconnected")
    sessionStorage.removeItem('app')
    sessionStorage.removeItem('id_db')
    sessionStorage.setItem('loggedIn','false')
    this.authservice.SignOut();
  }
}
