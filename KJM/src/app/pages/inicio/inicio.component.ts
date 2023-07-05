import { Component } from '@angular/core';
import { AppData } from 'src/app/models/appData';
import { AppDataService } from 'src/app/services/app-data.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {

  appStaticData: AppData = this.appData.getStaticData();

  constructor(private appData: AppDataService) {
    console.log("this.appStaticData", this.appStaticData);
  }

  isNewUser(){
    return this.appStaticData.isNewUser;
  }
}
