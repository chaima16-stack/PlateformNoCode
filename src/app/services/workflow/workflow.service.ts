import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {
  private apiUrl = 'http://127.0.0.1:8000/';
  constructor(private http: HttpClient) { }
  elements :any=[]
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
addAction(idevent:number,type:string,date_creation:Date){
  const body= {
    event: idevent,
    type: type,
    date_creation: date_creation.toISOString().slice(0, 10),  // Convertit la date en format ISO (YYYY-MM-DD)
    date_update: date_creation.toISOString().slice(0, 10)
  }
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
}
