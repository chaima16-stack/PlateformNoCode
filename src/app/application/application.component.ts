import { Component } from '@angular/core';
import { AppCreationServiceService } from '../services/app-service/app-creation-service.service';
import { Router } from '@angular/router';
import { DatabaseServiceService } from '../services/database-service/database-service.service';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css']
})
export class ApplicationComponent {
  appName: string = '';
  databaseName: string = '';
  numberOfScreens: number=0;
  description: string ='';
  
  constructor(private dbservice :DatabaseServiceService,public appService: AppCreationServiceService,private router: Router){}
 

  submitForm() {
   
   
    this.appService.addApp(this.appName,this.description,this.databaseName,new Date())
    .subscribe((response) => {
      this.dbservice.Createdb(this.databaseName).subscribe((data)=>{
        console.log(data)
      });
        this.router.navigate(['/Screen/'+response.id_app+'/'+this.numberOfScreens]);
      }, );
    
      
  }

}
