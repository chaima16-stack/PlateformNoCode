import { Injectable } from '@angular/core';
import { AppCreationServiceService } from '../app-service/app-creation-service.service';

@Injectable({
  providedIn: 'root'
})
export class DesignServiceService {
  activeLink: string = ''; 
  tables:any

  activeApp="Applications"; // Variable pour stocker l'application active
  buttons: any[] = [];
  listebuttons:any[]=[]
  inputs: any[]=[];
  listeinput:any[]=[]
  texts: any[]=[];
  listetext:any[]=[]
  icons: any[]=[];
  listeIcon:any[]=[]
  listelists:any[]=[]
  listeimages:any[]=[]
  images: any[]=[];
  lists: any[]=[];
  listItem:any[]=[]; // listes contient les elément dropped pour afficher la liste des élements du screen
  textButton="Button"
  textlabel="Text"
  textinput="Type a placeholder here ...."
  textlist=""
  itemsTaken :any //screens by app
  buttonColor= '#ffffff' // default color
  textcolor =""
  buttonclor=""
  textbuttonColor=""
  constructor(private appservice:AppCreationServiceService) { }
  getScreenByApp(){
    const id_app= sessionStorage.getItem('app')
    if(id_app)
     this.appservice.getScreensByApp(parseInt(id_app,10)).subscribe(response=>{
      const screensArray = Array.isArray(response) ? response : [response];
        this.itemsTaken = screensArray.map(screen => ({
          app: screen.app,
          date_creation: screen.date_creation,
          date_update: screen.date_update,
          id_screen: screen.id_screen,
          name_screen: screen.name_screen,
          type_screen: screen.type_screen,
          showSubItems: false
        }));})
     
  }
delete(element:any,liste:any){
  for(let i=0;i<liste.length;i++){
    if(liste[i].id==element.id){
      liste.splice(i,1);
      break;
    }
  }
}
ModifiyInnerHtml(element:any,liste:any,liste1:any){
  for(let j=0;j<liste.length;j++){
    if(liste[j].id==element.id){
     liste1[liste1.length-1].InnerHtml=liste[j].InnerHtml;
     break;
    }
}
}

AddElementToListItem(type:any,liste:any){
  
  for (let i = 0; i < liste.length; i++) {
    const element = liste[i] as HTMLElement;

    this.listItem.push({
      'type': type,
      'id': element.id
    })

  }
}
getIndex(liste:any,id:any):any{
  for (let i=0;i<liste.length;i++){
    if( liste[i].id == id)
        return i;
    
    }
}
generateRandomId(){
  return Math.floor(Math.random() * 1000); 
}

isIdUnique(id: any, tab:any): boolean {
  // Vérifier si l'identifiant est unique dans le tableau
  return !tab.includes(id);
}

getUniqueRandomId(typeId:any,tab: any) {
  let randomId: number;

  // Générer un identifiant aléatoire jusqu'à ce qu'il soit unique
  do {
      randomId = this.generateRandomId();
  } while (!this.isIdUnique(typeId+randomId, tab));

  return randomId;
}
}
