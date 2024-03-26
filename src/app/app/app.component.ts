import { Component } from '@angular/core';
import { count } from 'rxjs';
import { AppCreationServiceService } from '../services/app-service/app-creation-service.service';

@Component({
  selector: 'app-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  currentTab = 0;

  constructor(public appCreationService: AppCreationServiceService){}
 
   ngOnInit(): void {
    this.appCreationService.startCreatingApp();
    let tab1Element = document.getElementById('tab1');
    tab1Element!.style.display='block'
  }

   nextPrev(n: number):boolean | void  {
    const x = document.getElementsByClassName('tab')  as HTMLCollectionOf<HTMLElement>;
    if (n === 1 && !this.validateForm()) return false;
    x[this.currentTab].style.display = 'none';
    this.currentTab += n;
    this.showTab(this.currentTab);
    console.log(this.currentTab)
    if(x.length==this.currentTab-1){
      let y = document.getElementById('text-message') as HTMLElement
      y.style.display='block'
    }
  }
 
  inputChanged() {
    const x = document.getElementsByClassName('tab') as HTMLCollectionOf<HTMLElement>;
    this.validateForm();
  }

  validateForm(): boolean {
    const x = document.getElementsByClassName('tab') as HTMLCollectionOf<HTMLElement>;
    const inputs = x[this.currentTab].getElementsByTagName('input');
    let valid = true;
    for (let i = 0; i < inputs.length; i++) {
        if ((inputs[i] as HTMLInputElement).value === '') {
            (inputs[i] as HTMLElement).classList.add('invalid');
            valid = false;
        }
    }
    return valid;
}


  showTab(n: number) {
    const x = document.getElementsByClassName('tab') as HTMLCollectionOf<HTMLElement>;
    x[n].style.display = 'block';
  }
}