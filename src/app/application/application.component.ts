import { Component } from '@angular/core';
import { AppCreationServiceService } from '../services/app-service/app-creation-service.service';
import { Router } from '@angular/router';
import { DatabaseServiceService } from '../services/database-service/database-service.service';
import { AuthService } from '../services/auth-service/auth.service';

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
  
  constructor(private authservice:AuthService, private dbservice :DatabaseServiceService,public appService: AppCreationServiceService,private router: Router){}
 

  submitForm() {
   
    let token = sessionStorage.getItem("loggedInUser");
    this.authservice.decodeToken(token).subscribe((response:any)=>{
    this.appService.addApp(parseInt(response.user_id,10),this.appName,this.description,this.databaseName,new Date())
    .subscribe((data) => {
      this.dbservice.Createdb(this.databaseName).subscribe();
      sessionStorage.setItem('idappcreated', data.id_app)
        this.router.navigate(['/Screen/'+this.numberOfScreens]);
      }, );
    
    })
  }

}
