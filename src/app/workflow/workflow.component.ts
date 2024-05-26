import { AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth-service/auth.service';
import { DatabaseServiceService } from '../services/database-service/database-service.service';
import { AppCreationServiceService } from '../services/app-service/app-creation-service.service';
import { DesignServiceService } from '../services/design-service/design-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkflowService } from '../services/workflow/workflow.service';
declare var $: any;

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.css']
})
export class WorkflowComponent implements OnInit{
  constructor(public workflowservice:WorkflowService,private authservice:AuthService,private dbservice:DatabaseServiceService ,public appService: AppCreationServiceService,public designService:DesignServiceService,private route: ActivatedRoute,private router: Router){}
elementchoice =''
typechoice =''
ideventSelected:number=0;
events:any=[]

  ngOnInit(): void {
    this.designService.activeLink = 'Workflow'
    const app = sessionStorage.getItem('app')
    if(app){
      this.appService.getScreensByApp(parseInt(app,10)).subscribe((response:any)=>{
        const appsArray = Array.isArray(response) ? response : [response];
        for(let i=0; i<appsArray.length;i++){
          this.appService.getElmentByScreen(appsArray[i].id_screen).subscribe((data:any)=>{
            const elementsArray = Array.isArray(data) ? data : [data];
            for(let j=0;j<elementsArray.length;j++){
              let element={
                id_element:elementsArray[j].id_element,
                id_screen : appsArray[i].id_screen,
                name_screen : appsArray[i].name_screen, 
                label: elementsArray[j].label,
                type: elementsArray[j].type_element
              }
              this.workflowservice.elements.push(element);
             
            }
            
          })
        }
  
      })
      this.workflowservice.getEvents(parseInt(app,10)).subscribe((response:any)=>{
        const eventsArray = Array.isArray(response) ? response : [response];
       
        for(let j=0;j<eventsArray.length;j++){
          this.workflowservice.getActions(eventsArray[j].id).subscribe((result:any)=>{
     
            if(eventsArray[j].element!=null){
              this.appService.getElementById(eventsArray[j].element).subscribe((data:any)=>{
                let event={
                  id_event:eventsArray[j].id,
                  label: data.label,
                  type_element: data.type_element,
                  type:eventsArray[j].type,
                  actions:[],
                  element:eventsArray[j].id_element
                }
                event['actions']=result
                this.events.push(event)
              })
             }else {
              let event={
                label: '',
                type_element: '',
                id_event:eventsArray[j].id,
                type:eventsArray[j].type,
                actions:[],
                element:''
              }
              event['actions']=result
              this.events.push(event)
             }
           })
      
         
        }
      })
    }
  }
  openModal() {
    this.workflowservice.elements=[]
    this.getelements()
    
    $('#myModal').modal('show'); 
  }
  closeModal() {
    this.refresh()
    this.typechoice=""
    this.elementchoice=""
    $('#myModal').modal('hide'); 

  }
  openModalAction(idevent:number) {
    this.ideventSelected=idevent;
    $('#myModalAction').modal('show'); 
  }
  closeModalAction() {
    this.refresh()
    this.typechoice=''
    $('#myModalAction').modal('hide'); 

  }
getelements(){
  const app = sessionStorage.getItem('app')
  if(app){
    this.appService.getScreensByApp(parseInt(app,10)).subscribe((response:any)=>{
      const appsArray = Array.isArray(response) ? response : [response];
      for(let i=0; i<appsArray.length;i++){
        this.appService.getElmentByScreen(appsArray[i].id_screen).subscribe((data:any)=>{
          const elementsArray = Array.isArray(data) ? data : [data];
          for(let j=0;j<elementsArray.length;j++){
            let element={
              id_element:elementsArray[j].id_element,
              id_screen : appsArray[i].id_screen,
              name_screen : appsArray[i].name_screen, 
              label: elementsArray[j].label,
              type: elementsArray[j].type_element
            }
            this.workflowservice.elements.push(element);
          }
        })
      }
  
    })
  }
}
AddEvent(){
  const app = sessionStorage.getItem('app')
  if(app){
  this.workflowservice.addEvent(this.elementchoice,parseInt(app,10),this.typechoice,new Date()).subscribe((response)=>{
    console.log(response)
  }) 
}
  this.closeModal()
}
getevents(){
  
    for(let i=0;i<this.workflowservice.elements.length;i++){
      this.workflowservice.getEvents(this.workflowservice.elements[i].id_element).subscribe((response:any)=>{
        const eventsArray = Array.isArray(response) ? response : [response];
        
        for(let j=0;j<eventsArray.length;j++){
          let event={
            id_event:eventsArray[j].id,
            type:eventsArray[j].id,
            element:this.workflowservice.elements[i].id_element
          }
          this.events.push(event)
        }
      })
    }

}
refresh(){
  this.events=[]
  this.workflowservice.elements=[]
  const app = sessionStorage.getItem('app')
  if(app){
    this.appService.getScreensByApp(parseInt(app,10)).subscribe((response:any)=>{
      const appsArray = Array.isArray(response) ? response : [response];
      for(let i=0; i<appsArray.length;i++){
        this.appService.getElmentByScreen(appsArray[i].id_screen).subscribe((data:any)=>{
          const elementsArray = Array.isArray(data) ? data : [data];
          for(let j=0;j<elementsArray.length;j++){
            let element={
              id_element:elementsArray[j].id_element,
              id_screen : appsArray[i].id_screen,
              name_screen : appsArray[i].name_screen, 
              label: elementsArray[j].label,
              type: elementsArray[j].type_element
            }
            this.workflowservice.elements.push(element);
           
          }
          
        })
      }

    })
    this.workflowservice.getEvents(parseInt(app,10)).subscribe((response:any)=>{
      const eventsArray = Array.isArray(response) ? response : [response];
     
      for(let j=0;j<eventsArray.length;j++){
        this.workflowservice.getActions(eventsArray[j].id).subscribe((result:any)=>{
   
          if(eventsArray[j].element!=null){
            this.appService.getElementById(eventsArray[j].element).subscribe((data:any)=>{
              let event={
                id_event:eventsArray[j].id,
                label: data.label,
                type_element: data.type_element,
                type:eventsArray[j].type,
                actions:[],
                element:eventsArray[j].id_element
              }
              event['actions']=result
              this.events.push(event)
            })
           }else {
            let event={
              label: '',
              type_element: '',
              id_event:eventsArray[j].id,
              type:eventsArray[j].type,
              actions:[],
              element:eventsArray[j].id_element
            }
            event['actions']=result
            this.events.push(event)
           }
         })
    
       
      }
    })
  }
}
addAction(){
  this.workflowservice.addAction(this.ideventSelected,this.typechoice,new Date()).subscribe()
  
  this.closeModalAction()
}
deleteAction(id:number){
  this.workflowservice.deleteAction(id).subscribe();
  this.refresh()
}
deleteEvent(id:number){
  this.workflowservice.deleteEvent(id).subscribe();
 location.reload()
}
}
