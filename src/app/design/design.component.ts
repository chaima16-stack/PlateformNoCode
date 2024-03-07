import { Component } from '@angular/core';


@Component({
  selector: 'app-design',
  templateUrl: './design.component.html',
  styleUrls: ['./design.component.css'],

  
})
export class DesignComponent {
  draggedItem: any = null;
  draggedbutton=false; //test pour afficher le div sous forme d'un bouton
  draggedInput = false;
  draggedText=false;
  draggedIcon=false;
  draggedImage=false;
  draggedlist=false;
  subitem:any;
  buttons: any[] = []; // pour ajouter les styles des boutons qui contiennent les positions 
  inputs: any[]=[];
  texts: any[]=[];
  icons: any[]=[];
  images: any[]=[];
  lists: any[]=[];
  listItem:any[]=[]; // listes contient les elément dropped 
  testdropped=false // pour tester s'il s'agit des élement dropped
  k=0; // indice pour les ids des buttons dropped
  items = [
    { name: 'Elements Tree',subItems: [], showSubItems: false },
    { name: 'Elements', subItems: ['Text', 'Button', 'Icon','Image','Data List'] ,showSubItems: false},
    { name: 'Input Forms', subItems: ['Input'] ,showSubItems: false},

  ];
  itemsTaken = [
    { name: 'Screen 1', subItems: ['Text', 'Button', 'Icon','Image','Data List'],showSubItems: false },
   

  ];
  toggleSubItems(item:any): void {
    item.showSubItems = !item.showSubItems;
   
  }


  onDragStart(event: DragEvent,subItem:any) {
    this.draggedItem = event.target;
     this.subitem=subItem;
     
   
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: any) {
  
    if (this.draggedItem) {
      event.preventDefault();
      const page = document.getElementById("page");
      if (page) {
        const rect = page.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const style = {
          position: 'absolute',
          left: x + 'px',
          top: y + 'px',
          
        };
      
        switch(this.subitem){
          case 'Button': this.draggedbutton=true
          this.buttons.push({ style });break;
          case 'Input': this.draggedInput=true;
          this.inputs.push({ style });break;
          case'Text': this.draggedText=true;this.texts.push({ style });break;
          case'Icon': this.draggedIcon=true;this.icons.push({ style });break;
          case'Image': this.draggedImage=true;this.images.push({ style });break;
          case'Data List': this.draggedlist=true;this.lists.push({ style });break;
        }
    
       
       if(this.testdropped){
        this.draggedItem.remove();
        this.testdropped=false;
       }
       this.draggedItem = null;
      }
   
      console.log(this.draggedbutton)

    
  }

  }
  UpdateList(){
    let listbuttons = document.getElementsByClassName("buttonsdropped");
    let listtextes = document.getElementsByClassName("texte");
    let listinputs = document.getElementsByClassName("input-like");

    this.listItem=[]
    this.k=0
    for(let i = 0; i<listbuttons.length; i++){
      const buttondrop= listbuttons[i] as HTMLElement ;
      buttondrop.setAttribute('id','droppedButton'+this.k);
      buttondrop.setAttribute('type','submit');
      this.listItem.push({'type':'Button',
      'id':this.k }
)
      this.k++;
    }
    this.k=0;
    for(let i = 0; i<listtextes.length; i++){
      const textdrop= listtextes[i] as HTMLElement ;
      textdrop.setAttribute('id','droppedText'+this.k);
      this.listItem.push({'type':'Text',
      'id':this.k }
)
      this.k++;
    }
    this.k=0;
    for(let i = 0; i<listinputs.length; i++){
      const inputdrop= listinputs[i] as HTMLElement ;
      inputdrop.setAttribute('id','droppedInput'+this.k);
      this.listItem.push({'type':'Input',
      'id':this.k }
)
      this.k++;
    }
    
  }
  delete(subItem:any){
    if(subItem.type=='Button'){
      let buttondelete = document.getElementById('droppedButton'+subItem.id);
      if(buttondelete)
      buttondelete.remove();
    }
    else if (subItem.type=='Text'){
      let textdelete = document.getElementById('droppedText'+subItem.id);
      if (textdelete)
      textdelete.remove();
    }
    else if (subItem.type=='Input'){
      let inputdelete = document.getElementById('droppedInput'+subItem.id);
      console.log(inputdelete)
      if (inputdelete)
      inputdelete.remove();
    }
    else if (subItem.type=='Data List'){
      let listdelete = document.getElementById('droppedList'+subItem.id);
      if (listdelete)
      listdelete.remove();
    }
    else if (subItem.type=='Icon'){
      let icondelete = document.getElementById('droppedIcon'+subItem.id);
      if (icondelete)
      icondelete.remove();
    }
    else if (subItem.type=='Image'){
      let imagedelete = document.getElementById('droppedImage'+subItem.id);
      if (imagedelete)
      imagedelete.remove();
    }

    
  
     this.UpdateList();

  }
  ModifyDrag(event:any,type:any){
    this.draggedItem = event.target;
    this.testdropped=true;
    this.subitem=type;
  }
}
