import { Component, OnInit } from '@angular/core';
import { DatabaseServiceService } from '../services/database-service/database-service.service';
import { HttpClient } from '@angular/common/http';
declare var $: any;
@Component({
  selector: 'app-databases',
  templateUrl: './databases.component.html',
  styleUrls: ['./databases.component.css']
})
export class DatabasesComponent implements OnInit  {
  attributeTypes: string[] = [];
  attributeName="";
  selectedAttributeType="";
  islistField=false;
  isRequiredField=false;
  entityName ="";
  idattributeselected:any;
  typeform='insert';
  databaseconnected='';
  attributeselected="";
  data:any;
  formData='insert'
  iddataselected:any;
constructor(public dbservice:DatabaseServiceService, private http: HttpClient){}
ngOnInit(): void {
  this.loadAttributeTypes();
  this.databaseconnected=sessionStorage.getItem('dbconnected') || '';
  this.dbservice.refresTables()
}

  selectEntity(entity: any) {
    this.dbservice.selectedEntity = entity.name_entity; 
    this.dbservice.idTableSlected = entity.id;
    this.dbservice.AttributesByEntity();
  }
  openModal() {
    $('#myModal').modal('show'); 
  }
  closeModal() {
    this.refresh()
    $('#myModal').modal('hide'); 

  }
  loadAttributeTypes() {
    this.http.get('assets/attributes_types.txt', { responseType: 'text' }).subscribe(data => {
      // Diviser le contenu du fichier texte en lignes
      const lines = data.split('\n');
      // Ajouter chaque type d'attribut à la liste
      this.attributeTypes = lines.filter(line => line.trim() !== '');
      
    });
  }
AddEntity(){
  const iddb = sessionStorage.getItem('id_db')
  if(iddb){
  this.dbservice.addTable(this.entityName,parseInt(iddb,10),new Date()).subscribe();
  this.dbservice.InsertCollection(this.databaseconnected,this.entityName).subscribe()
  this.TableByDatabase()
  this.entityName=""
  }
}
AddAttribute(){
  const required = this.isRequiredField ? 'O': 'N';
  const listfield = this.islistField ? 'O' : 'N';
  this.dbservice.addNewAttribute(this.databaseconnected,this.dbservice.selectedEntity,this.attributeName).subscribe()
  this.dbservice.addAttribute(this.attributeName,this.selectedAttributeType,listfield,required,this.dbservice.idTableSlected,new Date()).subscribe()
  this.dbservice.AttributesByEntity()
  this.closeModal()
}

TableByDatabase(){
  const iddb = sessionStorage.getItem('id_db')
  if(iddb)
 this.dbservice.tableListByDatabase(parseInt(iddb,10)).subscribe((response)=>{
   this.dbservice.tables = Array.isArray(response) ? response : [response];
   
 })
}

refresh(){
  this.attributeName="";
  this.selectedAttributeType=""
  this.islistField=false;
  this.isRequiredField=false;
  this.typeform='insert'
}
deleteEntity(id:any){
  this.dbservice.deleteTable(id).subscribe();
  this.dbservice.getEntityById(id).subscribe((response:any)=>{
      this.dbservice.deleteCollection(this.databaseconnected,response.name_entity).subscribe(()=>{
      this.dbservice.refresTables()
      });
  })

}
deleteAttribute(attribut:any){
  this.dbservice.deleteAttributefromCollection(this.databaseconnected,this.dbservice.selectedEntity,attribut.name_attribute).subscribe()
  this.dbservice.deleteAttribute(attribut.id).subscribe(()=>{
    this.dbservice.AttributesByEntity();
  });
 
}
submitForm(){
  if(this.typeform=='update'){
    this.ModifyAttribute();
  }else{
    this.AddAttribute(); 
  }
  this.typeform='insert'
}
ModifyName(){ 
  this.dbservice.getEntityById(this.dbservice.idTableSlected).subscribe((data:any)=>{
    this.dbservice.UpdateNameCollection(this.databaseconnected,this.dbservice.selectedEntity,data.name_entity).subscribe()
})
  this.dbservice.ModifyTableName(this.dbservice.idTableSlected,this.dbservice.selectedEntity).subscribe(()=>{
      this.TableByDatabase()
  })
}
ModifyAttribute(){
 this.dbservice.updateAttibuteInCollection(this.databaseconnected,this.dbservice.selectedEntity,this.attributeselected,this.attributeName).subscribe()
  this.dbservice.ModifyAttribute(this.idattributeselected,this.attributeName,new Date()).subscribe(()=>{
    this.dbservice.AttributesByEntity()
    this.closeModal()
  })
}
modify(attribut:any){
  this.typeform='update'
  this.openModal()
  this.idattributeselected = attribut.id;
  this.attributeselected = attribut.name_attribute
  this.dbservice.listAttributes(attribut.id).subscribe((response:any)=>{
    this.attributeName = response.name_attribute
    
  })
}
openModalAdd() {
  $('#myModalAdd').modal('show'); 
  this.getData()
}
closeModalAdd() {
  this.refresh()
  $('#myModalAdd').modal('hide'); 
  

}
openModalData() {
  
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
  this.refresh()
  this.update=false
  this.formData='insert'
  for (let i=0; i<this.dbservice.attributes.length;i++){
    this.dbservice.attributes[i].value = ""
  }
  $('#myModalData').modal('hide'); 
  
}
generateArray(n:number): number[] {
  return Array(n).fill(0).map((x, i) => i);
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
AddData(){
  let body: Record<string, any> = {};
  for (let i=0;i<this.dbservice.attributes.length;i++){
     body[this.dbservice.attributes[i].name_attribute]=this.dbservice.attributes[i].value
  
  }
  body['Date_creation']= new Date().toISOString().slice(0, 19).replace('T', ' ');
  body['Date_update'] = new Date().toISOString().slice(0, 19).replace('T', ' ');
this.dbservice.insertData(this.databaseconnected,this.dbservice.selectedEntity,body).subscribe()
this.closeModalData()
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
  this.closeModalAdd()
  this.openModalData()
}
SubmitFormData(){
  if( this.formData=='insert')
    this.AddData()
  else this.ModifynewData()
 
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
  this.openModalAdd()
}
DeleteData(id:string){
  this.dbservice.deleteData(this.databaseconnected,this.dbservice.selectedEntity,id).subscribe();
  this.getData()
}
update=false
openselect(attr:any){
  attr.value=""
  this.update=true
}
}
