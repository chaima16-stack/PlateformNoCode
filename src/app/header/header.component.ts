import { Component } from '@angular/core';
import { AppCreationServiceService } from '../services/app-service/app-creation-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  activeLink: string = ''; 
constructor(public appCreationService: AppCreationServiceService){}
  setActiveLink(link: string): void {
    this.activeLink = link; 
  }

}
