import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
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
ModifyAttribute(id:number,attributename:string, type_attribute:string,listfield:string,required:string,date_update:Date){
  const body ={
    name_attribute: attributename,
    type_attribute: type_attribute,
    listField: listfield,
    required: required,
    date_update: date_update.toISOString().slice(0, 10)
    }
    
  return this.http.patch(this.apiUrl+'attributes/'+id+'/',body)
}
listAttributes(id:number){
  return this.http.get(this.apiUrl+'attributes/'+id)
}
}