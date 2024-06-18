import { Component, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppCreationServiceService } from 'src/app/services/app-service/app-creation-service.service';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { DatabaseServiceService } from 'src/app/services/database-service/database-service.service';
import { DesignServiceService } from 'src/app/services/design-service/design-service.service';
import { WorkflowService } from 'src/app/services/workflow/workflow.service';
declare var $: any;

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css']
})
export class CrudComponent {
  constructor(private renderer: Renderer2,public workflowservice:WorkflowService, private authservice:AuthService,public dbservice:DatabaseServiceService ,public appService: AppCreationServiceService,public designService:DesignServiceService,private route: ActivatedRoute,private router: Router){}
  elements:any[]=[]
  update=false
  data:any
  attributes:any
  alertVisible: boolean = false;
  alertMessage: string = '';
  alerts:any
  formData='insert'
  idattributeselected:any;
  databaseconnected='';

  ngOnInit(): void {
   sessionStorage.setItem('userconnected','1')
   sessionStorage.setItem('signup','true')
   this.workflowservice.alerts=[]

  const app=sessionStorage.getItem('app');
  const screen = sessionStorage.getItem('idscreen')
  this.databaseconnected=sessionStorage.getItem('dbconnected') || '';

  
      if(screen)
      this.appService.getElmentByScreen(parseInt(screen)).subscribe((response:any)=>{
        const elementsArray = Array.isArray(response) ? response : [response];
         for(let i=0;i<elementsArray.length;i++){
          const element={
             id: elementsArray[i].id_element,
             label : elementsArray[i].label,
             position: elementsArray[i].position,
             type_element: elementsArray[i].type_element,
             value:"",
             attributes : [],
             data : [],
             k :[],
             screen :elementsArray[i].screen
          }
          if(element.type_element=='Data List'){
            const iddb = sessionStorage.getItem('id_db')
            this.dbservice.selectedEntity = elementsArray[i].label
          
            if(iddb)
            this.appService.getIdEntityByDatabase(parseInt(iddb,10),elementsArray[i].label).subscribe((data:any)=>{
              this.dbservice.AttributeByEntity(data[0].id).subscribe((response)=>{
                this.dbservice.attributes= Array.isArray(response) ? response : [response];
                
                this.dbservice.attributes = this.dbservice.attributes.map((item:any) => ({ ...item, value: '' })); //ajouter un champs value pour l'utiliser lors d'un ajout de data dans le formulaire
                 element.attributes=this.dbservice.attributes
                 this.k=this.generateArray(this.dbservice.attributes.length)
                 element.k =this.k
                this.dbservice.getData(this.databaseconnected,elementsArray[i].label).subscribe((response:any)=>{
                  this.data= Array.isArray(response.result) ? response.result : [response.result];
                  element.data =this.data
                  
                })
              })
            })
          }
          this.elements.push(element)
         }
         
      })
     
   

     
     
      //workflow
      if(app)
      this.workflowservice.getEvents(parseInt(app,10)).subscribe((response:any)=>{
        const eventsArray = Array.isArray(response) ? response : [response];
        console.log(eventsArray)
        for(let i=0;i<eventsArray.length;i++){
          switch (eventsArray[i].type) {
            case 'User is logged in':
              console.log("hi")
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
                  console.log(elementRef)
                  this.renderer.listen(elementRef, 'click', () => this.handleElementClicked(eventsArray[i].id,eventsArray[i].element));
                }
              }//else error
              break;
            default:
              console.warn('Unknown event type:', eventsArray[i].type);
          }
        }
    })
  }
  
generateArray(n:number): number[] {
  return Array(n).fill(0).map((x, i) => i);
}

  getStyle(position: string) {
    return JSON.parse(position);
  }
  handleUserSignIn(idevent:any){
    
    const user=sessionStorage.getItem('signup')
    if(user){
      this.workflowservice.getActions(idevent).subscribe((response:any)=>{
      
        const actionsArray = Array.isArray(response) ? response : [response];
       
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
  console.log("hi")
   this.workflowservice.getActions(idevent).subscribe((response:any)=>{
    
    const actionsArray = Array.isArray(response) ? response : [response];
   
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
        default:
          console.warn('Unknown element ID:', idelement);
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
  
  }
  
  refresh(){
    console.log('Refreshing the page...');
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
     console.log(item)
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
      }else{//error
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
  openModalData() {
  console.log(this.dbservice.attributes)
    $('#myModalData').modal('show'); 
    this.getData()
    for (let i=0; i<this.dbservice.attributes.length;i++){   
      if(this.dbservice.attributes[i].listField=='O'){
        this.dbservice.getData(this.databaseconnected,this.dbservice.attributes[i].type_attribute).subscribe((response:any)=>{
          const array= response.result.map((item: any) => {
      
            let newItem = { ...item };
            delete newItem.Date_creation;
            delete newItem.Date_update;
            return newItem;
          });
       this.dbservice.attributes[i].info = array
        })
      }
    }
  }
  closeModalData() {
   
    this.update=false
    this.formData='insert'
    for (let i=0; i<this.dbservice.attributes.length;i++){
      this.dbservice.attributes[i].value = ""
    }
    $('#myModalData').modal('hide'); 
    
  }

  ModifyData(id:string){
    this.formData='update'
    this.idattributeselected= id
    this.dbservice.getDocumentById(this.databaseconnected,this.dbservice.selectedEntity,id).subscribe((response:any)=>{
      for (let i=0; i<this.dbservice.attributes.length;i++){    
        console.log(response.result[this.dbservice.attributes[i].name_attribute])
        this.dbservice.attributes[i].value = response.result[this.dbservice.attributes[i].name_attribute]
      }
    })

    this.openModalData()
  }
  SubmitFormData(){
    if( this.formData=='insert')
      this.AddData()
    else this.ModifynewData()
   
  }
  AddData(){
    let body: Record<string, any> = {};
    for (let i=0;i<this.dbservice.attributes.length;i++){
       body[this.dbservice.attributes[i].name_attribute]=this.dbservice.attributes[i].value
    
    }
  
  this.dbservice.insertData(this.databaseconnected,this.dbservice.selectedEntity,body).subscribe()
  location.reload();
  this.closeModalData()
  }
  ModifynewData(){
    let body: Record<string, any> = {};
    for (let i=0; i<this.dbservice.attributes.length;i++){
      let data = document.getElementById(this.dbservice.attributes[i].name_attribute) as HTMLInputElement
      if(data){
        if(this.dbservice.attributes[i].listField=='N')
        body[this.dbservice.attributes[i].name_attribute] = data.value;
        else body[this.dbservice.attributes[i].name_attribute]=this.dbservice.attributes[i].value
      }  
    }
    body['Date_update']=new Date().toISOString().slice(0, 19).replace('T', ' '); 
    this.dbservice.update_data(this.databaseconnected,this.dbservice.selectedEntity,body,this.idattributeselected).subscribe()
    this.closeModalData()
    location.reload();


  }

  DeleteData(id:string){
    this.dbservice.deleteData(this.databaseconnected,this.dbservice.selectedEntity,id).subscribe();
    location.reload();

  }

  index:any
getData(){
  this.dbservice.getData(this.databaseconnected,this.dbservice.selectedEntity).subscribe((response:any)=>{
      this.data= Array.isArray(response.result) ? response.result : [response.result];
      this.index=this.generateArray(this.dbservice.attributes.length)
      
  })
}
formatInfo(info: any,insert:boolean): string {
  if(!insert){
  const infoCopy = { ...info };
  delete infoCopy.id;
  return JSON.stringify(infoCopy);
}else return JSON.stringify(info);
  
}
openselect(attr:any){
  attr.value=""
  this.update=true
}
}
