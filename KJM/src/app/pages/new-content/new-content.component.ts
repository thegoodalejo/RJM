import { Component } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-content',
  templateUrl: './new-content.component.html',
  styleUrls: ['./new-content.component.css']
})
export class NewContentComponent {
  selectedTab: string = 'tab1'; // Tab inicialmente seleccionada
  selectedTabIndex: number = 1;

  constructor(private router: Router) {

  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  returnPage(event: MatTabChangeEvent) {
    if (event.index === 0)
      this.router.navigate(['/app-home/app-inicio']);
    if (event.index === 1)
      this.router.navigate(['/app-new-content/app-membrecia']);
    if (event.index === 2)
      this.router.navigate(['/app-new-content/app-coming-soon']);
    if (event.index == 3)
      this.router.navigate(['/app-admin-panel/app-gobierno']);
  }
}
