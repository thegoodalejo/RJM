import { Component } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent {

  selectedTab: string = 'tab1'; // Tab inicialmente seleccionada
  selectedTabIndex: number = 1;

  constructor(private router: Router) {

  }


  returnPage(event: MatTabChangeEvent){
    if (event.index === 0)
    this.router.navigate(['/app-new-content/app-membrecia']);
    if(event.index == 5)
    this.router.navigate(['/app-home/app-inicio']);
  }

}
