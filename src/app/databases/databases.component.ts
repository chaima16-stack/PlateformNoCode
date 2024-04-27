import { Component } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-databases',
  templateUrl: './databases.component.html',
  styleUrls: ['./databases.component.css']
})
export class DatabasesComponent {
  selectedEntity: string = ''; // Variable pour stocker l'entité sélectionnée

  selectEntity(entity: string) {
    this.selectedEntity = entity; 
  }
  openModal() {
    $('#myModal').modal('show'); // Afficher la fenêtre modale lors du clic sur le bouton
  }
  closeModal() {
    $('#myModal').modal('hide'); 
  }
}
