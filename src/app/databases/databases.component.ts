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
constructor(private dbservice:DatabaseServiceService, private http: HttpClient){}
ngOnInit(): void {
  this.loadAttributeTypes();
  this.dbservice.tableListByDatabase(14).subscribe((response)=>{
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
    $('#myModal').modal('show'); // Afficher la fenêtre modale lors du clic sur le bouton
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
  this.dbservice.addTable(this.entityName,14,new Date()).subscribe();
  this.TableByDatabase()
  this.entityName=""
}
AddAttribute(){
  const required = this.isRequiredField ? 'O': 'N';
  const listfield = this.islistField ? 'O' : 'N';
  this.dbservice.addAttribute(this.attributeName,this.selectedAttributeType,listfield,required,this.idTableSlected,new Date()).subscribe()
  this.AttributesByEntity()
  this.closeModal()
}

TableByDatabase(){
 this.dbservice.tableListByDatabase(14).subscribe((response)=>{
   this.tables = Array.isArray(response) ? response : [response];
 })
}
AttributesByEntity(){
  this.dbservice.AttributeByEntity(this.idTableSlected).subscribe((response)=>{
    this.attributes= Array.isArray(response) ? response : [response];
   
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
  location.reload()
}
deleteAttribute(id:any){
  this.dbservice.deleteAttribute(id).subscribe(()=>{
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
  this.dbservice.ModifyTableName(this.idTableSlected,this.selectedEntity).subscribe(()=>{
      this.TableByDatabase();
  })
}
ModifyAttribute(){
  const required = this.isRequiredField ? 'O': 'N';
  const listfield = this.islistField ? 'O' : 'N';
  this.dbservice.ModifyAttribute(this.idattributeselected,this.attributeName,this.selectedAttributeType,listfield,required,new Date()).subscribe(()=>{
    this.AttributesByEntity()
    this.closeModal()
  })
}
modify(id:number){
  this.typeform='update'
  this.openModal()
  this.idattributeselected = id; 
  this.dbservice.listAttributes(id).subscribe((response:any)=>{
    this.attributeName = response.name_attribute
    this.selectedAttributeType = response.type_attribute
    console.log(this.selectedAttributeType)
    this.islistField = response.listField == 'O' ? true : false;
    this.isRequiredField = response.required == 'O' ? true : false;
  })
}

}
