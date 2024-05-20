import { Component } from '@angular/core';
import { AppCreationServiceService } from '../services/app-service/app-creation-service.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.css']
})
export class ScreenComponent {
  screenName: string = '';
  screenType: string = '';
  numberscreen : number = 0;
  constructor(public appService:AppCreationServiceService,private route: ActivatedRoute,private router: Router){}
  ngOnInit(): void {
    this.screenName= '';
    this.screenType='';
    this.route.params.subscribe(params => {
       this.numberscreen = params['number_screen']
      
    });
    
  }

  submitForm() {
    const id_app= sessionStorage.getItem('idappcreated')
    if(id_app)
    this.appService.addScreen(this.screenName,this.screenType,parseInt(id_app,10),new Date())
    .subscribe(() => {
        this.screenName = '';
        this.screenType = '';
        this.numberscreen--;
        if(this.numberscreen==0){
          this.router.navigate(['/Design/']);
          sessionStorage.removeItem('idappcreated')
      }
        else
          this.router.navigate(['/Screen/'+this.numberscreen]);

      }, );  
  }
}
