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
  tables :any;
  idTableSlected:any;
  attributes :any;
  selectedEntity: string = ''; // Variable pour stocker l'entité sélectionnée
  idattributeselected:any;
  typeform='insert';
  databaseconnected='';
  attributeselected="";
  data:any;
  formData='insert'
  iddataselected:any;
constructor(private dbservice:DatabaseServiceService, private http: HttpClient){}
ngOnInit(): void {
  this.loadAttributeTypes();
  this.dbservice.getDataBase(17).subscribe((data:any)=>{
     this.databaseconnected = data.name_db
  })

  this.refresTables()
}
refresTables(){
  this.dbservice.tableListByDatabase(17).subscribe((response)=>{
    this.tables = Array.isArray(response) ? response : [response];
    for(let i=0; i<this.tables.length;i++){
      if(this.tables[i].name_entity == 'User'){
        this.idTableSlected = this.tables[i].id
        break;
      }
    }
    this.AttributesByEntity();
    this.selectedEntity ='User'
    
  })
}
  selectEntity(entity: any) {
    this.selectedEntity = entity.name_entity; 
    this.idTableSlected = entity.id;
    this.AttributesByEntity();
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
  this.dbservice.addTable(this.entityName,17,new Date()).subscribe();
  this.dbservice.InsertCollection(this.databaseconnected,this.entityName).subscribe()
  this.TableByDatabase()
  this.entityName=""
}
AddAttribute(){
  const required = this.isRequiredField ? 'O': 'N';
  const listfield = this.islistField ? 'O' : 'N';
  this.dbservice.addNewAttribute(this.databaseconnected,this.selectedEntity,this.attributeName).subscribe()
  this.dbservice.addAttribute(this.attributeName,this.selectedAttributeType,listfield,required,this.idTableSlected,new Date()).subscribe()
  this.AttributesByEntity()
  this.closeModal()
}

TableByDatabase(){
 this.dbservice.tableListByDatabase(17).subscribe((response)=>{
   this.tables = Array.isArray(response) ? response : [response];
   
 })
}
AttributesByEntity(){
  this.dbservice.AttributeByEntity(this.idTableSlected).subscribe((response)=>{
    this.attributes= Array.isArray(response) ? response : [response];
    this.attributes = this.attributes.map((item:any) => ({ ...item, value: '' })); //ajouter un champs value pour l'utiliser lors d'un ajout de data dans le formulaire
   
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
      this.refresTables()
      });
  })

}
deleteAttribute(attribut:any){
  this.dbservice.deleteAttributefromCollection(this.databaseconnected,this.selectedEntity,attribut.name_attribute).subscribe()
  this.dbservice.deleteAttribute(attribut.id).subscribe(()=>{
    this.AttributesByEntity();
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
  this.dbservice.getEntityById(this.idTableSlected).subscribe((data:any)=>{
    this.dbservice.UpdateNameCollection(this.databaseconnected,this.selectedEntity,data.name_entity).subscribe()
})
  this.dbservice.ModifyTableName(this.idTableSlected,this.selectedEntity).subscribe(()=>{
      this.TableByDatabase();
  })
}
ModifyAttribute(){
 this.dbservice.updateAttibuteInCollection(this.databaseconnected,this.selectedEntity,this.attributeselected,this.attributeName).subscribe()
  this.dbservice.ModifyAttribute(this.idattributeselected,this.attributeName,new Date()).subscribe(()=>{
    this.AttributesByEntity()
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
  console.log(this.attributes)
  $('#myModalData').modal('show'); 
  this.getData()

}
closeModalData() {
  this.refresh()
  this.formData='insert'
  for (let i=0; i<this.attributes.length;i++){
    this.attributes[i].value = ""
  }
  $('#myModalData').modal('hide'); 
  
}
generateArray(n:number): number[] {
  return Array(n).fill(0).map((x, i) => i);
}
index:any
getData(){
  this.dbservice.getData(this.databaseconnected,this.selectedEntity).subscribe((response:any)=>{
      this.data= Array.isArray(response.result) ? response.result : [response.result];
      this.index=this.generateArray(this.attributes.length)
      
  })
}
AddData(){
  let body: Record<string, any> = {};
  for (let i=0;i<this.attributes.length;i++){
     body[this.attributes[i].name_attribute]=this.attributes[i].value

  }
  body['Date_creation']= new Date().toISOString().slice(0, 19).replace('T', ' ');
  body['Date_update'] = new Date().toISOString().slice(0, 19).replace('T', ' ');
this.dbservice.insertData(this.databaseconnected,this.selectedEntity,body).subscribe()
this.closeModalData()
}
ModifyData(id:string){
  this.formData='update'
  this.idattributeselected= id
  this.dbservice.getDocumentById(this.databaseconnected,this.selectedEntity,id).subscribe((response:any)=>{
    for (let i=0; i<this.attributes.length;i++){
      this.attributes[i].value = response.result[this.attributes[i].name_attribute]
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
  for (let i=0; i<this.attributes.length;i++){
    let data = document.getElementById(this.attributes[i].name_attribute) as HTMLInputElement
    if(data)
      body[this.attributes[i].name_attribute] = data.value
    
  }
  body['Date_update']=new Date().toISOString().slice(0, 19).replace('T', ' '); 
  this.dbservice.update_data(this.databaseconnected,this.selectedEntity,body,this.idattributeselected).subscribe()

  this.closeModalData()
  this.openModalAdd()
}
DeleteData(id:string){
  this.dbservice.deleteData(this.databaseconnected,this.selectedEntity,id).subscribe();
  this.getData()
}
}
