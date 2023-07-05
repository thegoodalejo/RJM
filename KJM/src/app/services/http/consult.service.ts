import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscription, lastValueFrom } from 'rxjs';

import { AppDataService } from '../app-data.service';


@Injectable({
  providedIn: 'root'
})
export class ConsultService {

  private baseURl = 'https://legacysoftware.online/services/';

  userAuth$: any;
  userDb$: any;

  private subscriptionAuth: Subscription = new Subscription;
  private subscriptionDb: Subscription = new Subscription;

  constructor(private http: HttpClient, private appData: AppDataService) {
    console.log("ConsultService Online");

    this.subscriptionAuth = this.appData.userAuth$.subscribe(
      (userAuth) => {
        this.userAuth$ = userAuth;
      }
    );
    this.subscriptionDb = this.appData.userDb$.subscribe(
      (userDb) => {
        this.userDb$ = userDb;
      }
    );

  }

  obtenerMinisterios(): Observable<any> {
    const url = this.baseURl + 'get_ministerios.php';
    const body = new FormData();

    return this.http.post(url, body);
  }

  obtenerSedes(id_ministerio: string): Observable<any> {
    const url = this.baseURl + 'get_sedes.php';
    const body = new FormData();
    body.append('id_ministerio', id_ministerio);

    return this.http.post(url, body);
  }

  obtenerRedes(): Observable<any> {
    const url = this.baseURl + 'get_redes.php';
    const body = new FormData();

    return this.http.post(url, body);
  }

  async crearUsuario(data: any): Promise<any> {
    console.log("crearUsuario", data);
    console.log("crearUsuario", this.userAuth$.uid);
    const url = this.baseURl + 'create_usuario.php';
    const body = new FormData();

    body.append('id_ministerio', data.id_ministerio);
    body.append('id_sede', data.id_sede);
    body.append('id_firebaseRef', this.userAuth$.uid);
    body.append('email', this.userAuth$.email);
    body.append('numeroTelefonico', this.userAuth$.phoneNumber);

    const reqResp = this.http.post(url, body);
    const response = await lastValueFrom(reqResp);
    console.log("Respuesta del servicio:", response);

    return response;
  }
}
