import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';


@Component({
  selector: 'app-design',
  templateUrl: './design.component.html',
  styleUrls: ['./design.component.css'],

  
})
export class DesignComponent {
  iddropped:any
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
  listItem:any[]=[]; // listes contient les elément dropped pour afficher la liste des élements du screen
  testdropped=false // pour tester s'il s'agit des élement dropped
  listeIcon:any[]=[]
  listeinput:any[]=[]
  listeimages:any[]=[]
  listetext:any[]=[]
  listebuttons:any[]=[]
  listelists:any[]=[]
  textButton="Button"
  textlabel="Text"
  textinput=""
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
        const iconInfo = { 'style': {position: 'absolute',
        left: x + 'px',
        top: y + 'px',},
         'id':'droppedIcon'+this.getUniqueRandomId('droppedIcon',this.icons),
         'InnerHtml':'person','type': '' };
      
        switch(this.subitem){
          case 'Button': this.draggedbutton=true;iconInfo.type = 'Button';
          this.buttons.push(iconInfo);break;
          case 'Input': this.draggedInput=true;iconInfo.type = 'Input';
          this.inputs.push(iconInfo);break;
          case'Text': this.draggedText=true;iconInfo.type = 'Text';this.texts.push(iconInfo);break;
          case'Icon': this.draggedIcon=true;iconInfo.type = 'Icon';this.icons.push(iconInfo);break;
          case'Image': this.draggedImage=true;iconInfo.type = 'Image';this.images.push(iconInfo);break;
          case'Data List': this.draggedlist=true;iconInfo.type = 'Data List';this.lists.push(iconInfo);break;
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
    this.listItem=[]
    if(event!=true){
    switch(type){
      case 'Button':
        
          if(this.testdropped){
            const button= (event.target as HTMLElement)
            for(let i=0;i<this.buttons.length;i++){
              if(this.buttons[i].id==button.id){
                this.buttons.splice(i,1);
                break;
              }
            }
            this.buttons[this.buttons.length-1].id=button.id
            for(let j=0;j<this.listebuttons.length;j++){
                   if(this.listebuttons[j].id==button.id){
                    this.buttons[this.buttons.length-1].InnerHtml=this.listebuttons[j].InnerHtml;
                    break;
                   }
            }
           
            this.testdropped=false

          }
          const buttondrop= listbuttons[listbuttons.length-1] as HTMLElement ;
          if(!document.getElementById(buttondrop.id)){
            buttondrop.setAttribute('id',this.buttons[this.buttons.length-1].id);
             }
          
          break;
      case 'Input':
        if(this.testdropped){
          const input= (event.target as HTMLElement)
          for(let i=0;i<this.inputs.length;i++){
            if(this.inputs[i].id== input.id){
              this.inputs.splice(i,1);
              break;
            }
          }
          this.inputs[this.inputs.length-1].id=input.id
          for(let j=0;j<this.listeinput.length;j++){
                 if(this.listeinput[j].id==input.id){
                  this.inputs[this.inputs.length-1].InnerHtml=this.listeinput[j].InnerHtml;
                  break;
                 }
          }
         
          this.testdropped=false

        }
        const inputdrop= listinputs[listinputs.length-1] as HTMLElement ;
        if(!document.getElementById(inputdrop.id)){
          inputdrop.setAttribute('id',this.inputs[this.inputs.length-1].id);
           };break;

      case'Text': 
       if(this.testdropped){
          const text= (event.target as HTMLElement)
          for(let i=0;i<this.texts.length;i++){
            if(this.texts[i].id== text.id){
              this.texts.splice(i,1);
              break;
            }
          }
          this.texts[this.texts.length-1].id=text.id
          for(let j=0;j<this.listetext.length;j++){
                 if(this.listetext[j].id==text.id){
                  this.texts[this.texts.length-1].InnerHtml=this.listetext[j].InnerHtml;
                  break;
                 }
          }
         
          this.testdropped=false

        }
        const textdrop= listtextes[listtextes.length-1] as HTMLElement ;
        if(!document.getElementById(textdrop.id)){
          textdrop.setAttribute('id',this.texts[this.texts.length-1].id);
           };break;

      case'Icon': 
      
        if(this.testdropped){
          const icon= (event.target as HTMLElement)
          for(let i=0;i<this.icons.length;i++){
            if(this.icons[i].id==icon.id){
              this.icons.splice(i,1);
              break;
            }
          }
          this.icons[this.icons.length-1].id=icon.id
          for(let j=0;j<this.listeIcon.length;j++){
                 if(this.listeIcon[j].id==icon.id){
                  this.icons[this.icons.length-1].InnerHtml=this.listeIcon[j].InnerHtml;
                  break;
                 }
          }
         
          this.testdropped=false

        }
        let icondrop= listicons[listicons.length-1] as HTMLElement ;
        if(!document.getElementById(icondrop.id)){
          icondrop.setAttribute('id',this.icons[this.icons.length-1].id);
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
  for (let i = 0; i < listicons.length; i++) {
    const icondrop = listicons[i] as HTMLElement;

    this.listItem.push({
      'type': 'Icon',
      'id': icondrop.id
    })

  }
  for (let i = 0; i < listbuttons.length; i++) {
    const buttondrop = listbuttons[i] as HTMLElement;

    this.listItem.push({
      'type': 'Button',
      'id': buttondrop.id
    })

  }
  for (let i = 0; i < listinputs.length; i++) {
    const inputdrop = listinputs[i] as HTMLElement;

    this.listItem.push({
      'type': 'Input',
      'id': inputdrop.id
    })

  }
  for (let i = 0; i < listtextes.length; i++) {
    const textdrop = listtextes[i] as HTMLElement;

    this.listItem.push({
      'type': 'Text',
      'id': textdrop.id
    })

  }

  }


delete(subItem:any){
    if(subItem.type=='Button'){
      let buttondelete = document.getElementById(subItem.id);
      if(buttondelete){
      buttondelete.remove();
      for(let i=0;i<this.buttons.length;i++){
        if(this.buttons[i].id==subItem.id){
          this.buttons.splice(i,1)
          break;
        }
      }
      for(let i=0;i<this.listebuttons.length;i++){
        if(this.listebuttons[i].id==subItem.id){
          this.listebuttons.splice(i,1)
          break;
        }
      }
    }
    }
    else if (subItem.type=='Text'){
      let textdelete = document.getElementById(subItem.id);
      if (textdelete){
      textdelete.remove();
      for(let i=0;i<this.texts.length;i++){
        if(this.texts[i].id==subItem.id){
          this.texts.splice(i,1)
          break;
        }
      }
      for(let i=0;i<this.listetext.length;i++){
        if(this.listetext[i].id==subItem.id){
          this.listetext.splice(i,1)
          break;
        }
      }
    }
    }
    else if (subItem.type=='Input'){
      let inputdelete = document.getElementById(subItem.id);
      console.log(inputdelete)
      if (inputdelete){
      inputdelete.remove();
      for(let i=0;i<this.inputs.length;i++){
        if(this.inputs[i].id==subItem.id){
          this.inputs.splice(i,1)
          break;
        }
      }
      for(let i=0;i<this.listeinput.length;i++){
        if(this.listeinput[i].id==subItem.id){
          this.listeinput.splice(i,1)
          break;
        }
      }
    }
    }
    else if (subItem.type=='Data List'){
      let listdelete = document.getElementById(subItem.id);
      if (listdelete){
      listdelete.remove();
      for(let i=0;i<this.lists.length;i++){
        if(this.lists[i].id==subItem.id){
          this.lists.splice(i,1)
          break;
        }
      }
      for(let i=0;i<this.listelists.length;i++){
        if(this.listelists[i].id==subItem.id){
          this.listelists.splice(i,1)
          break;
        }
      }
    }
    }
    else if (subItem.type=='Icon'){
      let icondelete = document.getElementById(subItem.id);
      if (icondelete){
        icondelete.remove();
        for(let i=0;i<this.icons.length;i++){
          if(this.icons[i].id==subItem.id){
            this.icons.splice(i,1)
            break;
          }
        }
        for(let i=0;i<this.listeIcon.length;i++){
          if(this.listeIcon[i].id==subItem.id){
            this.listeIcon.splice(i,1)
            break;
          }
        }
      }
      console.log(this.listeIcon)
    }
    else if (subItem.type=='Image'){
      let imagedelete = document.getElementById(subItem.id);
      if (imagedelete){
      imagedelete.remove();
      for(let i=0;i<this.images.length;i++){
        if(this.images[i].id==subItem.id){
          this.images.splice(i,1)
          break;
        }
      }
      for(let i=0;i<this.listeimages.length;i++){
        if(this.listeimages[i].id==subItem.id){
          this.listeimages.splice(i,1)
          break;
        }
      }
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
                             for(let k=0;k<this.listeIcon.length;k++){
                              if(this.listeIcon[k].id==id){
                                this.listeIcon[k].InnerHtml=iconNameTrimmed;
                                test=true
                                break;
                              }
                             }
                             if(!test){
                              this.listeIcon.push({'id':id,'InnerHtml':iconNameTrimmed})
                             }
                            })
              }

              iconlist!.appendChild(row);
          }
      }
    }

ModifiyLabel(){
  let input= document.getElementById('input');

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
