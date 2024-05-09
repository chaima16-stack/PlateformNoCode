import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, noop, throwError } from 'rxjs';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';

@Injectable({
  providedIn: 'root'
})
export class DatabaseServiceService {

  constructor(private http: HttpClient) { }
  private apiUrl = 'http://127.0.0.1:8000/';
  addDatabase(databaseName:string,date_creation: Date): Observable<any>{
    const body={
      name_db: databaseName,
      date_creation: date_creation.toISOString().slice(0, 10),  // Convertit la date en format ISO (YYYY-MM-DD)
      date_update: date_creation.toISOString().slice(0, 10)
    }
    return this.http.post(this.apiUrl+'databases/', body)
    .pipe(
      catchError(this.handleError)
    )
  }
  private handleError(error: HttpErrorResponse): Observable<any> {
    console.error('An error occurred:', error);
    return throwError(error);  // Utilisation de throwError pour retourner un observable d'erreur
  }

addTable(tablename:string, db:number, date_creation :Date): Observable<any>{
  const body ={
    name_entity: tablename,
    db: db,
    date_creation: date_creation.toISOString().slice(0, 10),  // Convertit la date en format ISO (YYYY-MM-DD)
    date_update: date_creation.toISOString().slice(0, 10)
  }
  return this.http.post(this.apiUrl+'entities/',body).pipe(
    catchError(this.handleError)
  )
}

addAttribute(attributename:string, type_attribute:string,listfield:string,required:string,entityid:number,date_creation:Date): Observable<any>{
  const body ={
  name_attribute: attributename,
  type_attribute: type_attribute,
  listField: listfield,
  required: required,
  entity: entityid,
  date_creation: date_creation.toISOString().slice(0, 10),  // Convertit la date en format ISO (YYYY-MM-DD)
  date_update: date_creation.toISOString().slice(0, 10)
  }
  return this.http.post(this.apiUrl+'attributes/',body).pipe(
    catchError(this.handleError)
  )


}
addRelation(name_relation:string, type_attribute:string,date_creation:Date): Observable<any>{
  const body ={
   name_relation: name_relation,
   type_relation: type_attribute,
    date_creation: date_creation.toISOString().slice(0, 10),  // Convertit la date en format ISO (YYYY-MM-DD)
    date_update: date_creation.toISOString().slice(0, 10)
  }
  return this.http.post(this.apiUrl+'relations/',body).pipe(
    catchError(this.handleError)
  )
}
getDataBase(id:number){
  return this.http.get(this.apiUrl+'databases/'+id)
}
getEntityById(id:number){
  return this.http.get(this.apiUrl+'entities/'+id)
}
getAttributeById(id:number){
  return this.http.get(this.apiUrl+'attributes/'+id)
}
tableListByDatabase(idbd:number){
  const params = new HttpParams().set('db', idbd.toString());
  return this.http.get(this.apiUrl+'/entitiesByDatabase', { params });
}
AttributeByEntity(idEntity:number){
  const params = new HttpParams().set('entity', idEntity.toString());
  return this.http.get(this.apiUrl+'/attributesByEntity', { params });
}
deleteTable(idEntity:number){
  return this.http.delete(this.apiUrl+'entities/'+idEntity)
}
deleteAttribute(id:number){
  return this.http.delete(this.apiUrl+'attributes/'+id);
}
deleteDatabase(id:number){
  return this.http.delete(this.apiUrl+'databases/'+id)
}
ModifyTableName(id:number,newName:string){
  return this.http.patch(this.apiUrl+'entities/'+id+'/', {"name_entity": newName});
}
ModifyAttribute(id:number,attributename:string,date_update:Date){
  const body ={
    name_attribute: attributename,
    date_update: date_update.toISOString().slice(0, 10)
    }
    
  return this.http.patch(this.apiUrl+'attributes/'+id+'/',body)
}
listAttributes(id:number){
  return this.http.get(this.apiUrl+'attributes/'+id)
}

//Mongodb 
Createdb(db_name:string){
  const body={
    db_name: db_name
  }
  return this.http.post(this.apiUrl+'DatabasesApp/',body)
}

ModifyNamedb(old_db_name:string,new_db_name:string){
  const body={
    db_name: new_db_name,
    old_db_name: old_db_name
  }
  return this.http.put(this.apiUrl+'DatabasesApp/',body)
}

InsertCollection(db_name:string,collection_name:string){
  const body= {
    db_name: db_name,
    collection_name: collection_name
  }
  return this.http.post(this.apiUrl+'Collection/',body)
}
deleteCollection(db_name:string,collection_name:string){
 
  let params = new HttpParams()
  .set('db_name', db_name.toString())
  .set('collection_name', collection_name.toString());
  
  return this.http.delete(this.apiUrl+'/Collection', {params})
}
UpdateNameCollection(db_name:string,new_collection_name:string,old_collection_name:string){
  const body= {
    db_name: db_name,
    collection_name: new_collection_name,
    old_collection_name :old_collection_name
  }
  return this.http.put(this.apiUrl+'Collection/',body)
}

getData(db_name:string, collection_name:string){
  let params = new HttpParams()
  .set('db_name', db_name.toString())
  .set('collection_name', collection_name.toString());
  return this.http.get(`${this.apiUrl}Document/`, { params });
}

insertData(db_name:string,collection_name:string,attributes:any){
  const body={
    db_name: db_name,
    collection_name: collection_name,
    attributes : attributes
  }
  return this.http.post(this.apiUrl+'Document/',body)
}
update_data(db_name:string,collection_name:string,update_data:any,id:string){
  const body={
    db_name: db_name,
    collection_name: collection_name,
    attributes : update_data,
    id :id
  }
  return this.http.put(this.apiUrl+'Document/',body)
}
deleteData(db_name:string,collection_name:string,id:string){

  let params = new HttpParams()
  .set('db_name', db_name.toString())
  .set('collection_name', collection_name.toString())
  .set('id',id.toString());
  return this.http.delete(this.apiUrl+'Document/', {params})
}

deleteAttributefromCollection(db_name:string,collection_name:string,attributes:any){
  let params = new HttpParams()
  .set('db_name', db_name.toString())
  .set('collection_name', collection_name.toString())
  .set('attribute',attributes.toString());
  return this.http.delete(this.apiUrl+'Attribute/', {params})
}
updateAttibuteInCollection(db_name:string,collection_name:string,old_attribute_name:string,new_attribute_name:string){
  const body={
    db_name: db_name,
    attribute: new_attribute_name,
    old_attribute_name:old_attribute_name,
    collection_name:collection_name
  }

  return this.http.put(this.apiUrl+'Attribute/', body)
}
addNewAttribute(db_name:string,collection_name:string,attribut:string){
  const body={
    db_name: db_name,
    attribute: attribut,
    collection_name:collection_name
  }
  return this.http.post(this.apiUrl+'Attribute/',body)
}

getDocumentById(db_name:string,collection_name:string,id:string){
  let params = new HttpParams()
  .set('db_name', db_name.toString())
  .set('collection_name', collection_name.toString())
  .set('id',id.toString());
  return this.http.get(this.apiUrl+'DocumentsById/', {params})
}
}