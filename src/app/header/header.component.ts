import { Component, OnInit } from '@angular/core';
import { AppCreationServiceService } from '../services/app-service/app-creation-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  idActiveApp=0;
  activeLink: string = ''; 
  app:any
  activeApp="Applications"; // Variable pour stocker l'application active
  isDropdownOpen: boolean = false; // Variable pour suivre l'état du dropdown
  isDropdownOpenSetting =false
constructor(public appService: AppCreationServiceService,public appCreationService: AppCreationServiceService){}
ngOnInit(): void {
  //liste des apps d'user connecté 
  this.appService.getAppByUser(2).subscribe((response)=>{
    const appsArray = Array.isArray(response) ? response : [response];
    this.activeApp = appsArray[0].name;
    this.idActiveApp = appsArray[0].id_app
    this.app=appsArray.map(app=>({
      date_creation: app.date_creation,
      date_update: app.date_update,
      description: app.description,
      id_app: app.id_app,
      name_app: app.name,
      user: app.user,
      showSubItems: false
    }))
  });
}
  setActiveLink(link: string): void {
    this.activeLink = link; 
  }
 
  // Fonction pour définir l'application active
  setActiveApp(app: any) {
    this.activeApp = app.name_app;
    this.idActiveApp = app.id_app
    this.isDropdownOpen = false; // Fermer le dropdown après la sélection
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
}
