declare var google:any
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service/auth.service';

@Component({
  selector: 'app-authentification',
  templateUrl: './authentification.component.html',
  styleUrls: ['./authentification.component.css']
})
export class AuthentificationComponent implements OnInit {

 constructor(private authservice: AuthService, private router:Router){}
  ngOnInit(): void {
    sessionStorage.setItem('loggedIn','false')
      google.accounts.id.initialize({
        client_id : '362459692229-g8dpcd2tmfhoeo62eru4icu31f546bh1.apps.googleusercontent.com',
        callback: (resp:any)=>{
          console.log(resp)
          this.handleLogin(resp)}
      });
      google.accounts.id.renderButton(document.getElementById('google-btn'),{
        theme:'filled_black',
        size : 'large',
        shape:'pill',
        width: 200
      })
     
  }
  private decodeToken(token: string){
    return JSON.parse(atob(token.split(".")[1]));
  }

  handleLogin(response: any) {
    if (response) {
      const token = response.credential; // Obtenir le token Google OAuth
      this.authservice.authenticateWithGoogle(token).subscribe(
        (response:any) => {
          const jwtToken = response.token; // Obtenir le token JWT de la réponse
          sessionStorage.setItem('loggedInUser', jwtToken); // Stocker le token JWT dans le sessionStorage
          sessionStorage.setItem('loggedIn','true')
          this.router.navigate(['/Design']); // Redirection vers la page Design
        }
        
      );
    }
  }

  
}
