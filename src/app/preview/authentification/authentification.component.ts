import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppCreationServiceService } from 'src/app/services/app-service/app-creation-service.service';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { DatabaseServiceService } from 'src/app/services/database-service/database-service.service';
import { DesignServiceService } from 'src/app/services/design-service/design-service.service';
import { WorkflowService } from 'src/app/services/workflow/workflow.service';

@Component({
  selector: 'app-authentification',
  templateUrl: './authentification.component.html',
  styleUrls: ['./authentification.component.css']
})
export class AuthentificationComponent implements OnInit{
  constructor(private renderer: Renderer2,public workflowservice:WorkflowService, private authservice:AuthService,private dbservice:DatabaseServiceService ,public appService: AppCreationServiceService,public designService:DesignServiceService,private route: ActivatedRoute,private router: Router){}
elements:any[]=[]
alertVisible: boolean = false;
  alertMessage: string = '';
  alerts:any
  alerterror:boolean=false;
ngOnInit(): void {
  this.workflowservice.errors=[]
    this.workflowservice.alerts=[]
    const app=sessionStorage.getItem('app');
    const screen = sessionStorage.getItem('idscreen')
    sessionStorage.removeItem('userconnected')
    sessionStorage.removeItem('signup')

    if(screen)
    this.appService.getElmentByScreen(parseInt(screen)).subscribe((response:any)=>{
      const elementsArray = Array.isArray(response) ? response : [response];
      if(elementsArray.length==0) {this.workflowservice.errors.push({'type':"Elment", "description": "No elements added yet"})
        this.alerterror=true
    }
       for(let i=0;i<elementsArray.length;i++){
        const element={
           id: elementsArray[i].id_element,
           label : elementsArray[i].label,
           position: elementsArray[i].position,
           type_element: elementsArray[i].type_element,
           color: elementsArray[i].color,
           textcolor: elementsArray[i].textcolor,
           value:"",
           type_input:'',
           screen :elementsArray[i].screen
        }
        if(elementsArray[i].type_element=='Input'){
          this.workflowservice.getactionbyelement(elementsArray[i].id_element).subscribe((k:any)=>{
            if(k[0].champs=='Email'){
             element.type_input=  'email'
            }else if(k[0].champs=='Password'){
              element.type_input= 'password';
            }else 
            element.type_input='text'
          })

        }if(elementsArray[i].type_element=='Data List') {
          this.workflowservice.errors.push({'type':"Page Type", "description": "the type of the page is incorrect (is Authentification or sifn up page)"})
          this.alerterror=true

        }
        this.elements.push(element)
       }
       
    })
    if(app)
    this.workflowservice.getEvents(parseInt(app,10)).subscribe((response:any)=>{
      const eventsArray = Array.isArray(response) ? response : [response];
      if(eventsArray.length==0) {this.workflowservice.errors.push({'type':"Event", "description": "No events added yet"})
        this.alerterror=true
    }
      for(let i=0;i<eventsArray.length;i++){
        switch (eventsArray[i].type) {
          case 'User is logged in':
            this.handleUserLoggedIn(eventsArray[i].id);
            break;
          case 'User is logged out':
            this.handleUserLoggedOut(eventsArray[i].id);
            break;
          case 'User is sign up done':
            this.handleUserSignIn(eventsArray[i].id);
            break;
          case 'An element is clicked':
            if(eventsArray[i].element!='null'){
              const elementRef = document.getElementById(eventsArray[i].element);
              if (elementRef){
            
                this.renderer.listen(elementRef, 'click', () => this.handleElementClicked(eventsArray[i].id,eventsArray[i].element));
              }
            }else {
              this.workflowservice.errors.push({"type":eventsArray[i].type, "description": "error in element chosen"})
              this.alerterror=true
            }
            break;
          default:
            console.warn('Unknown event type:', eventsArray[i].type);
        }
      }
  })
}
getStyle(position: string) {
  return JSON.parse(position);
}
handleUserSignIn(idevent:any){
  
  const user=sessionStorage.getItem('signup')
  if(user){
    this.workflowservice.getActions(idevent).subscribe((response:any)=>{
    
      const actionsArray = Array.isArray(response) ? response : [response];
      if(actionsArray.length==0) {this.workflowservice.errors.push({'type':"Action", "description": "No action added yet"})
        this.alerterror=true
    }
      for(let i=0;i<actionsArray.length;i++){
      
    
        switch (actionsArray[i].type) {
          case 'Sign the user up':
             this.signUserUp(actionsArray[i].id);
            break;
          case 'Log the user in':
              this.logUserIn(actionsArray[i].id)
            break;
          case 'Sign/login with google':
           
            break;
          case 'Log the user out':
            this.logUserOut()
            break;
         
          case 'Refresh the page':
             this.refresh()
            break;
          case 'Clean the inputs':
             this.cleanInputs()
            break;
          case 'Color the inputs in red':
               this.colorInputsInRed();
            break;
          case 'Go to page...':
          const user= sessionStorage.getItem('userconnected')
          const sign= sessionStorage.getItem('signup')
           if(user || sign ){
          this.gotopage(actionsArray[i].id)}
            break;
           
        }
      }
    
    }) 
  }
  }
handleUserLoggedIn(idevent:any){
const user=sessionStorage.getItem('userconnected')
if(user){
  this.workflowservice.getActions(idevent).subscribe((response:any)=>{
  
    const actionsArray = Array.isArray(response) ? response : [response];
    if(actionsArray.length==0){ this.workflowservice.errors.push({'type':"Action", "description": "No action added yet"})
      this.alerterror=true
  }
    for(let i=0;i<actionsArray.length;i++){
    
  
      switch (actionsArray[i].type) {
        case 'Sign the user up':
           this.signUserUp(actionsArray[i].id);
          break;
        case 'Log the user in':
          
            this.logUserIn(actionsArray[i].id)
          break;
        case 'Sign/login with google':
         
          break;
        case 'Log the user out':
          this.logUserOut()
          break;
       
        case 'Refresh the page':
           this.refresh()
          break;
        case 'Clean the inputs':
           this.cleanInputs()
          break;
        case 'Color the inputs in red':
             this.colorInputsInRed();
          break;
        case 'Go to page...':
        const user= sessionStorage.getItem('userconnected')
        const sign= sessionStorage.getItem('signup')
        if(user || sign )
        this.gotopage(actionsArray[i].id)
          break;
        
      }
    }
  
  }) 
}
}

handleUserLoggedOut(idevent:any){
  const user=sessionStorage.getItem('userconnected')
  if(!user){
    this.workflowservice.getActions(idevent).subscribe((response:any)=>{
    
      const actionsArray = Array.isArray(response) ? response : [response];
      if(actionsArray.length==0) {this.workflowservice.errors.push({'type':"Action", "description": "No action added yet"})
        this.alerterror=true
    }
      for(let i=0;i<actionsArray.length;i++){
      
    
        switch (actionsArray[i].type) {
          case 'Sign the user up':
             this.signUserUp(actionsArray[i].id);
            break;
          case 'Log the user in':
            
              this.logUserIn(actionsArray[i].id)
            break;
          case 'Sign/login with google':
           
            break;
          case 'Log the user out':
            this.logUserOut()
            break;
         
          case 'Refresh the page':
             this.refresh()
            break;
          case 'Clean the inputs':
             this.cleanInputs()
            break;
          case 'Color the inputs in red':
               this.colorInputsInRed();
            break;
          case 'Go to page...':
        const user= sessionStorage.getItem('userconnected')
        const sign= sessionStorage.getItem('signup')
        if(user || sign )
          this.gotopage(actionsArray[i].id)
            break;
          
        }
      }
    
    }) 
  }
}
k:any=[];
handleElementClicked(idevent:any,idelement:any){

 this.workflowservice.getActions(idevent).subscribe((response:any)=>{
  
  const actionsArray = Array.isArray(response) ? response : [response];
  if(actionsArray.length==0) {this.workflowservice.errors.push({'type':"Action", "description": "No action added yet"})
    this.alerterror=true
  }
  for(let i=0;i<actionsArray.length;i++){
  

    switch (actionsArray[i].type) {
      case 'Sign the user up':
         this.signUserUp(actionsArray[i].id);
        break;
      case 'Log the user in':
        
          this.logUserIn(actionsArray[i].id)
        break;
      case 'Sign/login with google':
       
        break;
      case 'Log the user out':
        this.logUserOut()
        break;
     
      case 'Refresh the page':
         this.refresh()
        break;
      case 'Clean the inputs':
         this.cleanInputs()
        break;
      case 'Color the inputs in red':
           this.colorInputsInRed();
        break;
      case 'Go to page...':
        const user= sessionStorage.getItem('userconnected')
        const sign= sessionStorage.getItem('signup')
        if(user || sign )
         this.gotopage(actionsArray[i].id)
        break;
     
    }
  }

}) 

}
cleanInputs(){
   // Parcourir les éléments pour créer l'item
   for (let i = 0; i < this.elements.length; i++) {
    if (this.elements[i].type_element == 'Input') {
       this.elements[i].value="";
      
    }
  }
}

logUserOut(){
  sessionStorage.removeItem('userconnected')
  
}
closeAlert() {
  this.alertVisible = false; 
  this.workflowservice.alerts=[]
this.alerterror=false
}

refresh(){
  location.reload();
}
logUserIn(idaction:any){
  const db = sessionStorage.getItem('dbconnected');
   this.workflowservice.getelementbyaction(idaction).subscribe((data:any)=>{

    let item: Record<string, any> = {};
    for (let j = 0; j < data.length; j++){
    for (let i = 0; i < this.elements.length; i++) {
      if (this.elements[i].id == data[j].element) {
        item[data[j].champs] = this.elements[i].value;
        
        break; 
      }
    }
    }
    const db = sessionStorage.getItem('dbconnected');
    if (db) {
    this.dbservice.getData(db, 'User').subscribe((response: any) => {
  
      const itemExists = response.result.filter((resItem: any) => {
        return Object.keys(item).every(key => item[key] === resItem[key]);
      });
    if (itemExists.length>0) {
      
      this.alerts={type:"success",message:'Informations are corrects'}
       console.log(itemExists)
       this.workflowservice.getToken(itemExists[0].id).subscribe((info:any)=>{
        sessionStorage.setItem('userconnected',info.token)  
           })
      /* const app = sessionStorage.getItem('app')
      if(app)
      this.appService.getScreensByApp(parseInt(app,10)).subscribe((response:any)=>{
         let test=false;
         let idscreen=0;
         for(let i=0; i<response.length;i++){
          if(response[i].type_screen!='Authtenfication'){
            idscreen = response[i].id_screen
           test=true
           break;
          }
         }
         if(test){
          this.alertVisible=false
          sessionStorage.setItem('screenvisited',idscreen.toString())
          this.router.navigate(['/crud']);
        }else {//error
          
         }

        }) */

    } else {
      this.colorInputsInRed()
      this.alerts={type:"danger", message:'verify the informations!!!'}
    }
    this.alertVisible = true;
   })
  }
   })

}
signUserUp(idaction:any){
  const db = sessionStorage.getItem('dbconnected');
  this.workflowservice.getelementbyaction(idaction).subscribe((data:any)=>{
   
   let item: Record<string, any> = {};
   for (let j = 0; j < data.length; j++){
   for (let i = 0; i < this.elements.length; i++) {
     if (this.elements[i].id == data[j].element) {
       item[data[j].champs] = this.elements[i].value;
       break; 
     }
   }
   }
 
   const db = sessionStorage.getItem('dbconnected');
   if (db) {
   this.dbservice.getData(db, 'User').subscribe((response: any) => {
    const itemExists = response.result.filter((resItem: any) => {
      return Object.keys(item).every(key => item[key] === resItem[key]);
    });
   if (itemExists.length==0) {
     if(Object.keys(item).length>1){
     this.alerts={type:"success",message:'Informations are corrects'}
     this.dbservice.insertData(db,'User',item).subscribe()
     sessionStorage.setItem("signup","true")
    }else{         
      this.workflowservice.errors.push({'type':"Action", "description": "inputs chosen are not corrects"})
      this.alerterror=true

    }

   } else {
     this.colorInputsInRed()
     this.alerts={type:"danger", message:'informations exits already!!!'}
   }
   this.alertVisible = true;
  })
 }

  })
}
colorInputsInRed() {
  
  const inputs = document.querySelectorAll('.input-like');
  inputs.forEach(input => {
    (input as HTMLElement).style.borderColor = 'red';
  });
}
gotopage(idaction:number){
  this.workflowservice.getActionbyid(idaction).subscribe((response:any)=>{
     this.appService.getScreenbyId(response.screen).subscribe((data:any)=>{
      sessionStorage.setItem('idscreen',response.screen)
      if(data.type_screen== "Authtenfication"){
        this.router.navigate(['/login']);
      }else{
        this.router.navigate(['/crud']);
      }
     })
  })
}

}