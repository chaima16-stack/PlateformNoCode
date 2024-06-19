import { Component, OnInit } from '@angular/core';
import { AppCreationServiceService } from '../services/app-service/app-creation-service.service';
import { AuthService } from '../services/auth-service/auth.service';
import { DatabaseServiceService } from '../services/database-service/database-service.service';
import { DesignServiceService } from '../services/design-service/design-service.service';
import { Router } from '@angular/router';
import { WorkflowService } from '../services/workflow/workflow.service';
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  app:any
  screenchoice=""
  isDropdownOpen: boolean = false; // Variable pour suivre l'état du dropdown
  isDropdownOpenSetting =false
  isDropdownOpenalert =false
nberrors=0;
constructor(private router: Router,public workflowservice:WorkflowService ,private authservice:AuthService,private dbservice:DatabaseServiceService, public appService: AppCreationServiceService,public appCreationService: AppCreationServiceService,public designService:DesignServiceService){}
ngOnInit(): void {
  //liste des apps d'user connecté 
  this.nberrors= this.workflowservice.errors.length
  let token = sessionStorage.getItem("loggedInUser");
  this.authservice.decodeToken(token).subscribe((response:any)=>{
  this.appService.getAppByUser(parseInt(response.user_id,10)).subscribe((response)=>{
    const appsArray = Array.isArray(response) ? response : [response];
    let app= sessionStorage.getItem('app')
    if(app)
    for(let i=0;i<appsArray.length;i++){
      if(parseInt(app,10)==appsArray[i].id_app){
         this.designService.activeApp = appsArray[i].name
         break;
      }
    }
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
  toggleDropdownalert() {
    this.isDropdownOpenalert = !this.isDropdownOpenalert;
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
  openModal() {
    this.designService.getScreenByApp()
    $('#myModals').modal('show'); 
  }
  closeModal() {
    
    this.screenchoice=""
    $('#myModals').modal('hide'); 

  }
  formscreen(){
    sessionStorage.setItem('idscreen',this.screenchoice)
    this.appService.getScreenbyId(parseInt(this.screenchoice,10)).subscribe((response:any)=>{
      console.log(response)
      if(response.type_screen=='Authtenfication'){
        this.router.navigate(['/preview/login']);
      }else 
      {
        this.router.navigate(['/preview/crud']);
      }
    })
    
    this.closeModal()
  }
}
