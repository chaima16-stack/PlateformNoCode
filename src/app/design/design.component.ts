import { Component } from '@angular/core';


@Component({
  selector: 'app-design',
  templateUrl: './design.component.html',
  styleUrls: ['./design.component.css'],

  
})
export class DesignComponent {

  items = [
    { name: 'Elements Tree',subItems: [], showSubItems: false },
    { name: 'Elements', subItems: ['Text', 'Button', 'Icon','Image','Data List'] ,showSubItems: false},
    { name: 'Input Forms', subItems: ['Input'] ,showSubItems: false},

  ];
  itemsTaken = [
    { name: 'Screen 1', subItems: ['Text', 'Button', 'Icon','Image','Data List'],showSubItems: false },
   

  ];
  toggleSubItems(item:any): void {
    item.showSubItems = !item.showSubItems;
    console.log(item.showSubItems);
  }
}
