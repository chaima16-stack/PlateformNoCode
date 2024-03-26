import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppCreationServiceService {
  isCreatingApp: boolean = false;

  constructor() { }
  startCreatingApp() {
    this.isCreatingApp = true;
  }


}
