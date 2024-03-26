import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { DesignServiceService } from '../services/design-service/design-service.service';


@Component({
  selector: 'app-design',
  templateUrl: './design.component.html',
  styleUrls: ['./design.component.css'],

  
})
export class DesignComponent {
  draggedItem: any = null;//prendre l'element dragged
  draggedbutton=false; //test pour afficher le div sous forme d'un bouton le cas ou l'element est dropped
  draggedInput = false;
  draggedText=false;
  draggedIcon=false;
  draggedImage=false;
  draggedlist=false;
  subitem:any;
  testdropped=false // pour tester s'il s'agit des élement dropped

  items = [
    { name: 'Elements Tree',subItems: [], showSubItems: false },
    { name: 'Elements', subItems: ['Text', 'Button', 'Icon','Image','Data List'] ,showSubItems: false},
    { name: 'Input Forms', subItems: ['Input'] ,showSubItems: false},

  ];
  itemsTaken = [
    { name: 'Screen 1', subItems: ['Text', 'Button', 'Icon','Image','Data List'],showSubItems: false },
   

  ];
  constructor(public designService:DesignServiceService){}

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
        const Info = { 'style': {position: 'absolute',
        left: x + 'px',
        top: y + 'px',},
         'id':'',
         'InnerHtml':'person','type': '' };
      
        switch(this.subitem){
          case 'Button': this.draggedbutton=true;Info.type = 'Button';Info.id='droppedButton'+this.designService.getUniqueRandomId('droppedButton',this.designService.buttons)
          this.designService.buttons.push(Info);break;
          case 'Input': this.draggedInput=true;Info.type = 'Input';Info.id='droppedInput'+this.designService.getUniqueRandomId('droppedInput',this.designService.inputs)
          this.designService.inputs.push(Info);break;
          case'Text': this.draggedText=true;Info.type = 'Text';Info.id='droppedText'+this.designService.getUniqueRandomId('droppedText',this.designService.texts);this.designService.texts.push(Info);break;
          case'Icon': this.draggedIcon=true;Info.type = 'Icon';Info.id='droppedIcon'+this.designService.getUniqueRandomId('droppedIcon',this.designService.icons);this.designService.icons.push(Info);break;
          case'Image': this.draggedImage=true;Info.type = 'Image';Info.id='droppedImage'+this.designService.getUniqueRandomId('droppedImage',this.designService.images);this.designService.images.push(Info);break;
          case'Data List': this.draggedlist=true;Info.type = 'Data List';Info.id='droppedlist'+this.designService.getUniqueRandomId('droppedlist',this.designService.lists);this.designService.lists.push(Info);break;
        }
       if(this.testdropped){
        this.draggedItem.remove();
       
       }
       this.draggedItem = null;
      }
  }
  

  }


UpdateList(event:any,type:any){
    let listbuttons = document.getElementsByClassName("buttonsdropped");
    let listtextes = document.getElementsByClassName("texte");
    let listinputs = document.getElementsByClassName("input-like");
    let listicons = document.getElementsByClassName("icon-like");
    this.designService.listItem=[]
    if(event!=true){
    switch(type){
      case 'Button':
        
          if(this.testdropped){
            const button= (event.target as HTMLElement)
            this.designService.delete(button,this.designService.buttons)
            this.designService.buttons[this.designService.buttons.length-1].id=button.id
            this.designService.ModifiyInnerHtml(button,this.designService.listebuttons,this.designService.buttons);
            this.testdropped=false

          }
          const buttondrop= listbuttons[listbuttons.length-1] as HTMLElement ;
          if(!document.getElementById(buttondrop.id)){
            buttondrop.setAttribute('id',this.designService.buttons[this.designService.buttons.length-1].id);
             }
          
          break;
      case 'Input':
        if(this.testdropped){
          const input= (event.target as HTMLElement)
          this.designService.delete(input,this.designService.inputs)
          this.designService.inputs[this.designService.inputs.length-1].id=input.id
          this.designService.ModifiyInnerHtml(input,this.designService.listeinput,this.designService.inputs);
          this.testdropped=false

        }
        const inputdrop= listinputs[listinputs.length-1] as HTMLElement ;
        if(!document.getElementById(inputdrop.id)){
          inputdrop.setAttribute('id',this.designService.inputs[this.designService.inputs.length-1].id);
           };break;

      case'Text': 
       if(this.testdropped){
          const text= (event.target as HTMLElement)
          this.designService.delete(text,this.designService.texts)
          this.designService.texts[this.designService.texts.length-1].id=text.id
          this.designService.ModifiyInnerHtml(text,this.designService.listetext,this.designService.texts);
          this.testdropped=false

        }
        const textdrop= listtextes[listtextes.length-1] as HTMLElement ;
        if(!document.getElementById(textdrop.id)){
          textdrop.setAttribute('id',this.designService.texts[this.designService.texts.length-1].id);
           };break;

      case'Icon': 
      
        if(this.testdropped){
          const icon= (event.target as HTMLElement)
          this.designService.delete(icon,this.designService.icons)
          this.designService.icons[this.designService.icons.length-1].id=icon.id
          this.designService.ModifiyInnerHtml(icon,this.designService.listeIcon,this.designService.icons);
          this.testdropped=false

        }
        let icondrop= listicons[listicons.length-1] as HTMLElement ;
        if(!document.getElementById(icondrop.id)){
          icondrop.setAttribute('id',this.designService.icons[this.designService.icons.length-1].id);
           }
      
      
       break;
      case'Image': 
        if(this.testdropped){


        }break;
      case'Data List': 
        if(this.testdropped){


        }break;
    }
  }
 
  this.designService.AddElementToListItem('Icon',listicons)
  this.designService.AddElementToListItem('Button',listbuttons)
  this.designService.AddElementToListItem('Input',listinputs)
  this.designService.AddElementToListItem('Text',listtextes)
  }


delete(subItem:any){

    if(subItem.type=='Button'){
      let buttondelete = document.getElementById(subItem.id);
      if(buttondelete){
      buttondelete.remove();
      this.designService.delete(subItem,this.designService.buttons)
      this.designService.delete(subItem,this.designService.listebuttons)
    }
    }
    else if (subItem.type=='Text'){
      let textdelete = document.getElementById(subItem.id);
      if (textdelete){
      textdelete.remove();
      this.designService.delete(subItem,this.designService.texts)
      this.designService.delete(subItem,this.designService.listetext)

    }
    }
    else if (subItem.type=='Input'){
      let inputdelete = document.getElementById(subItem.id);
      console.log(inputdelete)
      if (inputdelete){
      inputdelete.remove();
      this.designService.delete(subItem,this.designService.inputs)
      this.designService.delete(subItem,this.designService.listeinput)
    }
    }
    else if (subItem.type=='Data List'){
      let listdelete = document.getElementById(subItem.id);
      if (listdelete){
      listdelete.remove();
      this.designService.delete(subItem,this.designService.lists)
      this.designService.delete(subItem,this.designService.listelists)
    }
    }
    else if (subItem.type=='Icon'){
      let icondelete = document.getElementById(subItem.id);
      if (icondelete){
        icondelete.remove();
        this.designService.delete(subItem,this.designService.icons)
        this.designService.delete(subItem,this.designService.listeIcon)

      }
    }
    else if (subItem.type=='Image'){
      let imagedelete = document.getElementById(subItem.id);
      if (imagedelete){
      imagedelete.remove();
      this.designService.delete(subItem,this.designService.images)
      this.designService.delete(subItem,this.designService.listeimages)
    }
    }
     this.UpdateList(true,true);
 
  }

 ModifyDrag(event:DragEvent,type:any){
    this.draggedItem = event.target;
    this.testdropped=true;
    this.subitem=type;
   
    
  }

  //popup 
typepopup=''
popUpOpened=true;
nbpopupOpned=0;
showPopUp(event:any,idpopup:any,idclose:any,type:any) {
  let popup = document.getElementById(idpopup)!;
  let closeBtn = document.getElementById(idclose)!;
  const id = (event.target as HTMLElement).closest('[id]')!.id;
  
    document.getElementById(id)!.addEventListener('click', () => {
            if (this.nbpopupOpned==0){
              popup.style.display = 'block'; 
              this.nbpopupOpned++;
              
             } else {
            popup.style.display = 'none';
            popup.style.display = 'block'; 
        
  }});
          closeBtn.addEventListener('click', () => {
              this.nbpopupOpned=0;
              popup.style.display = 'none';
              
          });
          this.typepopup=type
         this.makeDraggable(popup);
      }
  


makeDraggable(element: HTMLElement) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (document.getElementById(element.id + "-header")) {
            document.getElementById(element.id + "-header")!.onmousedown = dragMouseDown;
        } else {
            element.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e: MouseEvent) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e: MouseEvent) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }


showIcon(event: any) {
      let currentPage = 1; // Page actuelle
      const iconsPerPage = 42; // Nombre d'icônes par page
      const iconsPerRow = 6; // Nombre d'icônes par ligne
      const iconlist = document.getElementById('iconList');
      const nextPageBtn = document.getElementById("nextPageBtn");
      const prevPageBtn = document.getElementById("prevPageBtn");

      const id = (event.target as HTMLElement).closest('[id]')!.id
      let icon = document.getElementById(id);

       this.showPopUp(event,'popupIcon','closeIcon','Icon')
      // Charger les icônes
      fetch('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css')
          .then(response => response.text())
          .then(data => {
              const iconNames = data.match(/\.bi-[a-zA-Z0-9-]+/g);
              if (iconNames) {
                  // Calculer le nombre total de pages
                  const totalPages = Math.ceil(iconNames.length / iconsPerPage);
  
                  // Afficher la première page d'icônes
                  showIcons(currentPage, iconNames);
  
                  // Mettre à jour la pagination lors du clic sur le bouton de page suivante
                  nextPageBtn!.addEventListener('click', () => {
                      if (currentPage < totalPages) {
                          currentPage++;
                          showIcons(currentPage, iconNames);
                      }
                  });
  
                  // Mettre à jour la pagination lors du clic sur le bouton de page précédente
                  prevPageBtn!.addEventListener('click', () => {
                      if (currentPage > 1) {
                          currentPage--;
                          showIcons(currentPage, iconNames);
                      }
                  });
              }
          });
  
      // Fonction pour afficher les icônes de la page spécifiée
      const showIcons = (page:any, iconNames:any) => {
          // Réinitialiser le contenu de la liste d'icônes
          iconlist!.innerHTML = '';
  
          // Calculer l'indice de départ et l'indice de fin des icônes à afficher sur la page actuelle
          const startIndex = (page - 1) * iconsPerPage;
          const endIndex = Math.min(startIndex + iconsPerPage, iconNames.length);
          // Générer les options d'icônes pour la page actuelle
          for (let i = startIndex; i < endIndex; i += iconsPerRow) {
              const row = document.createElement("div");
              row.classList.add("row");
              
              for (let j = 0; j < iconsPerRow && i + j < endIndex; j++) {
                  const iconNameTrimmed = iconNames[i + j].slice(4);
                  const iconOption = document.createElement("div");
                  iconOption.classList.add("col-md-2");
                  iconOption.innerHTML = `<i class="bi bi-${iconNameTrimmed}"></i>`;
                  row.appendChild(iconOption);
                  iconOption.addEventListener('click',()=>{
                             icon!.innerHTML=`<i class="bi bi-${iconNameTrimmed}"></i>`;
                             let test=false
                             for(let k=0;k<this.designService.listeIcon.length;k++){
                              if(this.designService.listeIcon[k].id==id){
                                this.designService.listeIcon[k].InnerHtml=iconNameTrimmed;
                                test=true
                                break;
                              }
                             }
                             if(!test){
                              this.designService.listeIcon.push({'id':id,'InnerHtml':iconNameTrimmed})
                             }
                            })
              }

              iconlist!.appendChild(row);
          }
      }
    }


  

}
