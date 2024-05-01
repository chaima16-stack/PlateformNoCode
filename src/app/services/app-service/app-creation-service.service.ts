import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, switchMap, throwError } from 'rxjs';
import { DatabaseServiceService } from '../database-service/database-service.service';

@Injectable({
  providedIn: 'root'
})
export class AppCreationServiceService {
  isCreatingApp: boolean = false;
  idApp = 0;
  
  constructor(private http: HttpClient, private dbservice: DatabaseServiceService) { }
  startCreatingApp() {
    this.isCreatingApp = true;
  }
  private apiUrl = 'http://127.0.0.1:8000/';

  
  addApp(name: string, description: string, databaseName: string, date_creation: Date): Observable<any> {
    // Appel addDatabase pour ajouter la base de données
    return this.dbservice.addDatabase(databaseName, date_creation).pipe(
      switchMap(response => {
        let id_db = response;
        const body = {
          name: name,
          description: description,
          user: 2,
          database: id_db,
          date_creation: date_creation.toISOString().slice(0, 10),  // Convertit la date en format ISO (YYYY-MM-DD)
          date_update: date_creation.toISOString().slice(0, 10)
        };
  
        // Effectuer la requête HTTP pour ajouter l'application
        return this.http.post(this.apiUrl + 'apps/', body).pipe(
          catchError(this.handleError)
        );
      })
    );
  }
  
 

  addScreen(name: string, screenType: string,id_app:number, date_creation: Date): Observable<any> {
    const body = {
      name_screen: name,
      type_screen: screenType,
      app : id_app,
      date_creation: date_creation.toISOString().slice(0, 10),  // Convertit la date en format ISO (YYYY-MM-DD)
      date_update: date_creation.toISOString().slice(0, 10)
    };
    
    return this.http.post(this.apiUrl+'screens/', body)
      .pipe(
        catchError(this.handleError) 
      );
  }

  validateForm() {
    const x = document.getElementsByClassName('tab') as HTMLCollectionOf<HTMLElement>;
   
    for (let i = 0; i < x.length; i++) {
      const inputs = x[i].getElementsByTagName('input');
      for(let j=0;j<inputs.length;j++){
        if ((inputs[j] as HTMLInputElement).value === '') {
          (inputs[j] as HTMLElement).classList.add('input-invalid');
          break;
      }
      }
    }
}
getScreensByApp(appId: number){
  const params = new HttpParams().set('app', appId.toString());
  return this.http.get(this.apiUrl+'/appScreens', { params });
}
getAppByUser(userId: number){
  const params = new HttpParams().set('user',userId.toString());
  return this.http.get(this.apiUrl+'/appbyUser', { params });
}
getScreen(){
  return this.http.get(this.apiUrl+'/screens');
}

AddElementByScreen(screenid: number,elementid:string, Type_element: string, label :string, position: string, date_creation:Date){
  const body = {
    screen: screenid,
    id_element:elementid,
    type_element:Type_element,
    label:label,
    position:position,
    date_creation: date_creation.toISOString().slice(0, 10),  // Convertit la date en format ISO (YYYY-MM-DD)
    date_update: date_creation.toISOString().slice(0, 10)
  };
  return this.http.post(this.apiUrl+'elements/', body)
  .pipe(
    catchError(this.handleError) // Utilisation de catchError avec la fonction de gestion d'erreur
  );
}
ModifiyLabel(label:string, id:string){

  return this.http.patch(this.apiUrl+ 'elements/'+id +'/', {"label":label }) .pipe(
    catchError(this.handleError) 
  );
}
getElmentByScreen(idscreen:number){
  const params = new HttpParams().set('screen', idscreen.toString());
  return this.http.get(this.apiUrl+'/elementByScreens', { params });
}
deleteElement(id:string){
   return this.http.delete(this.apiUrl+'elements/'+id)
}
ModifiyPosition(position:string,id:string){

  return this.http.patch(this.apiUrl+ 'elements/'+id +'/', {"position":position }) .pipe(
    catchError(this.handleError) 
  );
}
deleteScreen(id:any){
  return this.http.delete(this.apiUrl+'screens/'+id)
}
deleteApp(id:any){
  return this.http.delete(this.apiUrl+'apps/'+id)
}

private handleError(error: HttpErrorResponse): Observable<any> {
  console.error('An error occurred:', error);
  return throwError(error);  // Utilisation de throwError pour retourner un observable d'erreur
}
}
