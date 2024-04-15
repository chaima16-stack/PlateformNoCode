import { Component } from '@angular/core';
import { AppCreationServiceService } from '../services/app-service/app-creation-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css']
})
export class ApplicationComponent {
  appName: string = '';
  numberOfScreens: number=0;
  description: string ='';
  
  constructor(public appService: AppCreationServiceService,private router: Router){}
 

  submitForm() {
   
   
    this.appService.addApp(this.appName,this.description,new Date())
    .subscribe((response) => {
        console.log( response);
        this.router.navigate(['/Screen/'+response.id_app+'/'+this.numberOfScreens]);
      }, );

      
  }

}
