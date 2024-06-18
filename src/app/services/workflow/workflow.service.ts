import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {
  private apiUrl = 'http://127.0.0.1:8000/';
  constructor(private http: HttpClient) { }
  elements :any=[]
  alertType="danger"
  alerts:any=[]
   item: Record<string, any> = {};
    table=""
    alertVisible=false
addEvent(idelement:string,idapp:number,type:string,date_creation:Date)
{
  if(idelement== "null"){
    const body= {
      app:idapp,
      type: type,
      date_creation: date_creation.toISOString().slice(0, 10),  // Convertit la date en format ISO (YYYY-MM-DD)
      date_update: date_creation.toISOString().slice(0, 10)
    }
    return this.http.post(this.apiUrl+'events/',body)}
    else {
const body= {
  app:idapp,
  element: idelement,
  type: type,
  date_creation: date_creation.toISOString().slice(0, 10),  // Convertit la date en format ISO (YYYY-MM-DD)
  date_update: date_creation.toISOString().slice(0, 10)
}
return this.http.post(this.apiUrl+'events/',body)}

}
addAction(idevent:number,type:string,screenid:any,date_creation:Date){
  const body= {
    event: idevent,
    type: type,
    screen:screenid,
    date_creation: date_creation.toISOString().slice(0, 10),  // Convertit la date en format ISO (YYYY-MM-DD)
    date_update: date_creation.toISOString().slice(0, 10)
  }
 if(screenid==null) delete body.screen
  return this.http.post(this.apiUrl+'actions/',body)
}
getEvents(app:number){
  const params = new HttpParams().set('app', app.toString());
  return this.http.get(this.apiUrl+'/EventByElement', { params });
}
getActions(idevent:number){
  const params = new HttpParams().set('event', idevent.toString());
  return this.http.get(this.apiUrl+'/ActionByEvent', { params });
}
deleteEvent(id:number){
  return this.http.delete(this.apiUrl+'events/'+id);
}
deleteAction(id:number){
  return this.http.delete(this.apiUrl+'actions/'+id);
}
getActionByelement(idelement:any){
  const params = new HttpParams().set('element', idelement);

  return this.http.get(this.apiUrl+'/ActionByEvent', { params });
}
addElementAction(idaction:any,idelement:any, champs:string, tablename:string){
const body={
  champs:champs,
  table_name:tablename,
  element:idelement,
  action:idaction
}
return this.http.post(this.apiUrl+'elementsactions/', body)
}
getactionbyelement(idelement:any){
  const params = new HttpParams().set('element', idelement);

return this.http.get(this.apiUrl+'/Actionelement', { params })
}
getelementbyaction(idaction:any){
  const params = new HttpParams().set('action', idaction);

return this.http.get(this.apiUrl+'/Actionelement', { params })
}
getelementaction(idaction:any,idelement:any){
  const params = new HttpParams()
  .set('action', idaction)
  .set('element', idelement);

return this.http.get(this.apiUrl+'/Actionelement', { params })
}
getActionbyid(id:number){
  return this.http.get(this.apiUrl+'actions/'+id);
}
getToken(id:string){
  const params = new HttpParams().set('id',id);

  return this.http.get(this.apiUrl+'/Token',{ params })
}
}
