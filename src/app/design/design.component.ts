import {  Component, OnInit} from '@angular/core';
import { DesignServiceService } from '../services/design-service/design-service.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AppCreationServiceService } from '../services/app-service/app-creation-service.service';

@Component({
  selector: 'app-design',
  templateUrl: './design.component.html',
  styleUrls: ['./design.component.css'],

  
})
export class DesignComponent implements OnInit {
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
  appName: string = '';
  numberOfScreens: number=0;
  description: string ='';
  app:any // apps by user connected
  itemsTaken :any //screens by app
  idscreen:any
  constructor(public appService: AppCreationServiceService,public designService:DesignServiceService,private route: ActivatedRoute,private router: Router){}
 
  ngOnInit(): void {
    //liste des apps d'user connecté 
    this.refreshListApp();
  }
refreshListApp(){
  this.appService.getAppByUser(2).subscribe((response)=>{
    const appsArray = Array.isArray(response) ? response : [response];
    this.app=appsArray.map(app=>({
      date_creation: app.date_creation,
      date_update: app.date_update,
      description: app.description,
      id_app: app.id_app,
      name_app: app.name,
      user: app.user,
      showSubItems: false
    }))
  });
}
getScreenByApp(appitem:any){
   this.appService.getScreensByApp(appitem.id_app).subscribe(response=>{
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
   this.toggleSubItems(appitem)
   for(let i=0;i<this.app.length;i++){
    if(this.app[i]!=appitem && this.app[i].showSubItems){
      this.toggleSubItems(this.app[i])
    }
   }
}
getElement(item:any){
    this.designService.buttons=[]
    this.designService.inputs=[]
    this.designService.texts=[]
    this.designService.icons=[]
    this.designService.listItem=[]
    this.appService.getElmentByScreen(item.id_screen).subscribe((response) => {
      const elementsArray = Array.isArray(response) ? response : [response];
      for (let i = 0; i < elementsArray.length; i++) {
        const obj = JSON.parse(elementsArray[i].position);
        let element = {
          style: obj,
          id: elementsArray[i].id_element,
          InnerHtml: elementsArray[i].label,
          type: elementsArray[i].type_element
        };
        switch(element.type){
          case 'Button': this.designService.buttons.push(element);break;
          case 'Input': this.designService.inputs.push(element);break;
          case 'Text':this.designService.texts.push(element);break;
          case 'Icon': this.designService.icons.push(element);break;
        }

        this.designService.listItem.push({
            'type':elementsArray[i].type_element,
            'id':elementsArray[i].id_element
        })
      }
      this.draggedbutton = true; 
      this.draggedInput = true; 
      this.draggedText = true;
      this.draggedIcon = true;
      this.draggedText =true;
    });
  
  
    this.toggleSubItems(item)
    this.idscreen=item.id_screen
   for(let i=0;i<this.itemsTaken.length;i++){
    if(this.itemsTaken[i]!=item && this.itemsTaken[i].showSubItems){
      this.toggleSubItems(this.itemsTaken[i])
    }
   }
  
  }
deleteApp(id:any){
  this.appService.deleteApp(id).subscribe((response) => {
    location.reload();
  }, )
 
}
deleteScreen(appitem:any){
  this.appService.deleteScreen(appitem.id_screen).subscribe((response) => {
    location.reload();
  }, )
  
}
 
 
 addApp() {
    this.appService.addApp(this.appName,this.description,new Date())
    .subscribe((response) => {
        console.log( response);
        this.router.navigate(['/Screen/'+response.id_app+'/'+this.numberOfScreens]);
      }, );
  }

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
          case 'Button': this.draggedbutton=true;Info.type = 'Button';Info.InnerHtml = 'Button';Info.id='droppedButton'+this.designService.getUniqueRandomId('droppedButton',this.designService.buttons)
          this.designService.buttons.push(Info);
          if(!this.testdropped)
            this.appService.AddElementByScreen(this.idscreen,Info.id, 'Button','Button', JSON.stringify(Info.style), new Date()).subscribe();
          break;
          case 'Input': this.draggedInput=true;Info.type = 'Input';Info.InnerHtml='';Info.id='droppedInput'+this.designService.getUniqueRandomId('droppedInput',this.designService.inputs)
          this.designService.inputs.push(Info);
          if(!this.testdropped)
            this.appService.AddElementByScreen(this.idscreen,Info.id, 'Input','Input', JSON.stringify(Info.style), new Date()).subscribe();break;
          case'Text': this.draggedText=true;Info.type = 'Text';Info.InnerHtml = 'Text';Info.id='droppedText'+this.designService.getUniqueRandomId('droppedText',this.designService.texts);this.designService.texts.push(Info);
          if(!this.testdropped)
            this.appService.AddElementByScreen(this.idscreen,Info.id, 'Text','Text', JSON.stringify(Info.style), new Date()).subscribe();break;
          case'Icon': this.draggedIcon=true;Info.type = 'Icon';Info.id='droppedIcon'+this.designService.getUniqueRandomId('droppedIcon',this.designService.icons);this.designService.icons.push(Info);
          if(!this.testdropped)
            this.appService.AddElementByScreen(this.idscreen,Info.id, 'Icon','person', JSON.stringify(Info.style), new Date()).subscribe();break;
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
            this.designService.buttons[this.designService.buttons.length-1].InnerHtml=button.innerHTML
            this.testdropped=false
            this.appService.ModifiyPosition(JSON.stringify(this.designService.buttons[this.designService.buttons.length-1].style),button.id).subscribe()
          }
          const buttondrop= listbuttons[listbuttons.length-1]  as HTMLElement;
          if(!document.getElementById(buttondrop.id)){
            buttondrop.setAttribute('id',this.designService.buttons[this.designService.buttons.length-1].id);
             }
          
          break;
      case 'Input':
        if(this.testdropped){
          const input= (event.target as HTMLElement)
          this.designService.delete(input,this.designService.inputs)
          this.designService.inputs[this.designService.inputs.length-1].id=input.id
          this.designService.inputs[this.designService.inputs.length-1].InnerHtml=input.innerHTML
          this.testdropped=false
          this.appService.ModifiyPosition(JSON.stringify(this.designService.inputs[this.designService.inputs.length-1].style),input.id).subscribe()
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
          this.designService.texts[this.designService.texts.length-1].InnerHtml=text.innerHTML
          this.testdropped=false
          this.appService.ModifiyPosition(JSON.stringify(this.designService.texts[this.designService.texts.length-1].style),text.id).subscribe()
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
          this.appService.ModifiyPosition(JSON.stringify(this.designService.icons[this.designService.icons.length-1].style),icon.id).subscribe()
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
      this.appService.deleteElement(subItem.id).subscribe()
    }
    }
    else if (subItem.type=='Text'){
      let textdelete = document.getElementById(subItem.id);
      if (textdelete){
      textdelete.remove();
      this.designService.delete(subItem,this.designService.texts)
      this.designService.delete(subItem,this.designService.listetext)
      this.appService.deleteElement(subItem.id).subscribe()
    }
    }
    else if (subItem.type=='Input'){
      let inputdelete = document.getElementById(subItem.id);
      if (inputdelete){
      inputdelete.remove();
      this.designService.delete(subItem,this.designService.inputs)
      this.designService.delete(subItem,this.designService.listeinput)
      this.appService.deleteElement(subItem.id).subscribe()
    }
    }
    else if (subItem.type=='Data List'){
      let listdelete = document.getElementById(subItem.id);
      if (listdelete){
      listdelete.remove();
      this.designService.delete(subItem,this.designService.lists)
      this.designService.delete(subItem,this.designService.listelists)
      this.appService.deleteElement(subItem.id).subscribe()
    }
    }
    else if (subItem.type=='Icon'){
      let icondelete = document.getElementById(subItem.id);
      if (icondelete){
        icondelete.remove();
        this.designService.delete(subItem,this.designService.icons)
        this.designService.delete(subItem,this.designService.listeIcon)
        this.appService.deleteElement(subItem.id).subscribe()
      }
    }
    else if (subItem.type=='Image'){
      let imagedelete = document.getElementById(subItem.id);
      if (imagedelete){
      imagedelete.remove();
      this.designService.delete(subItem,this.designService.images)
      this.designService.delete(subItem,this.designService.listeimages)
      this.appService.deleteElement(subItem.id).subscribe()
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
index:any;
showPopUp(event:any,idpopup:any,idclose:any,type:any) {
  let popup = document.getElementById(idpopup)!;
  let closeBtn = document.getElementById(idclose)!;
  let id = (event.target as HTMLElement).closest('[id]')!.id;
  
    document.getElementById(id)!.addEventListener('click', () => {
            if (this.nbpopupOpned==0){
              popup.style.display = 'block'; 
              this.nbpopupOpned++;
              switch(type){
                case 'Button': this.index=this.designService.getIndex(this.designService.buttons,id)   
                this.designService.textButton= this.designService.buttons[this.index].InnerHtml;break;
                case 'Input': this.index=this.designService.getIndex(this.designService.inputs,id)   
                this.designService.textinput= this.designService.inputs[this.index].InnerHtml;break;
                case 'Text': this.index=this.designService.getIndex(this.designService.texts,id)   
                this.designService.textlabel= this.designService.texts[this.index].InnerHtml;break;
              }
              
             }
             else {
            popup.style.display = 'none';
            popup.style.display = 'block'; 
         }
});
          closeBtn.addEventListener('click', () => {
              this.nbpopupOpned=0;
              switch(type){
                case 'Button': this.designService.buttons[this.index].InnerHtml = this.designService.textButton
                this.appService.ModifiyLabel(this.designService.textButton,this.designService.buttons[this.index].id).subscribe();break;
                case 'Input':  this.designService.inputs[this.index].InnerHtml = this.designService.textinput
                this.appService.ModifiyLabel(this.designService.textinput,this.designService.inputs[this.index].id).subscribe();break;
                case 'Text':  this.designService.texts[this.index].InnerHtml = this.designService.textlabel
                this.appService.ModifiyLabel(this.designService.textlabel,this.designService.texts[this.index].id).subscribe();break;
              }
             
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
                             console.log(this.designService.listeIcon.length)
                             //le cas de modifier 
                             for(let k=0;k<this.designService.listeIcon.length;k++){
                              
                              if(this.designService.listeIcon[k].id==id){
                                this.designService.listeIcon[k].InnerHtml=iconNameTrimmed;
                                console.log(iconNameTrimmed)
                                console.log(id)
                                this.appService.ModifiyLabel(iconNameTrimmed,id).subscribe()
                                test=true
                                break;
                              }
                             }
                             //le cas d'ajouter un nouveau icon
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
