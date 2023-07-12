import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable, Subscription, lastValueFrom } from 'rxjs';

import { AppDataService } from '../app-data.service';
import UserDb from 'src/app/models/userDb';
import { MatDialog } from '@angular/material/dialog';
import { LoadingModalComponent } from 'src/app/components/loading-modal/loading-modal.component';
import NuevoMiembro from 'src/app/models/nuevoMiembro';


@Injectable({
  providedIn: 'root'
})
export class ConsultService {


  dialogRef: any;

  private baseURl = 'https://legacysoftware.online/services/';

  userAuth$: any;
  public userDb$: any;

  private subscriptionAuth: Subscription = new Subscription;
  private subscriptionDb: Subscription = new Subscription;

  constructor(
    private http: HttpClient,
    private appData: AppDataService,
    private dialog: MatDialog) {
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

  async obtenerAppData(id_sede: any): Promise<any> {

    const url = this.baseURl + 'get_app_data.php';
    const body = new FormData();
    body.append('id_sede', id_sede);

    const reqResp = this.http.post(url, body);
    const response = await lastValueFrom(reqResp);

    return response;
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

  async obtenerRedes(): Promise<any> {
    const url = this.baseURl + 'get_redes.php';
    const body = new FormData();

    body.append('id_sede', this.userDb$.id_sede);

    const reqResp = this.http.post(url, body);
    const response = await lastValueFrom(reqResp);
    console.log("obtenerRedes =>", response);

    return response;    
  }

  async obtenerUsuariosSede(): Promise<any> {
    const url = this.baseURl + 'get_nuevos_usuarios.php';
    const body = new FormData();

    body.append('id_sede', this.userDb$.id_sede);

    const reqResp = this.http.post(url, body);
    const response = await lastValueFrom(reqResp);
    console.log("obtenerUsuariosNuevos =>", response);

    return response;
  }

  async obtenerUsuarioIndividual(data: any): Promise<any> {
    const url = this.baseURl + 'get_usuario_individual.php';
    const body = new FormData();

    body.append('id_firebaseRef', data.id_firebaseRef);
    body.append('email', data.email);
    body.append('phoneNumber', data.phoneNumber);
    body.append('displayName', data.displayName);

    const reqResp = this.http.post(url, body);
    const response = await lastValueFrom(reqResp);
    console.log("obtenerUsuarioIndividual =>", response);
    this.appData.updateUserDb(response as UserDb);
  }

  async actualizarUsuarioOnBoarding(data: any): Promise<any> {
    console.log("actualizarUsuario data =>", data);
    const url = this.baseURl + 'update_usuario_onBoarding.php';
    const body = new FormData();

    body.append('id', this.userDb$.id);
    body.append('id_ministerio', data.id_ministerio);
    body.append('id_sede', data.id_sede);

    const reqResp = this.http.post(url, body);
    const response: any = await lastValueFrom(reqResp);
    console.log("actualizarUsuario =>", response);
    return response.action;
  }

  async actualizarUsuarioActivar(data: any): Promise<boolean> {

    const url = this.baseURl + 'update_usuario_activacion.php';
    const body = new FormData();

    body.append('id', data.id);
    body.append('activo', data.activo);

    const reqResp = this.http.post(url, body);
    const response: any = await lastValueFrom(reqResp);

    console.log("actualizarUsuarioActivar =>", response);
    return response.action;
  }

  async actualizarUsuarioInfo(data: any): Promise<boolean> {
    this.dialogRef = this.dialog.open(LoadingModalComponent, {
      disableClose: true,
      panelClass: 'custom-modal-container' // Ajusta el nombre de la clase según tus estilos
    });

    this.dialogRef.componentInstance.open('loading');

    const url = this.baseURl + 'update_usuario_info.php';
    const body = new FormData();

    body.append('id', data.id);
    body.append('rol', data.rol);
    body.append('displayName', data.displayName);
    body.append('numeroTelefonico', data.numeroTelefonico);

    const reqResp = this.http.post(url, body);
    const response: any = await lastValueFrom(reqResp);

    console.log("actualizarUsuarioInfo =>", response);
    this.dialogRef.componentInstance.close();
    return response.action;

  }

  async crearNuevoMiembro(data: any): Promise<boolean> {
    this.dialogRef = this.dialog.open(LoadingModalComponent, {
      disableClose: true,
      panelClass: 'custom-modal-container' // Ajusta el nombre de la clase según tus estilos
    });

    this.dialogRef.componentInstance.open('loading');

    const url = this.baseURl + 'create_miembro.php';
    const body = new FormData();

    body.append('id_sede', this.userDb$.id_sede);
    body.append('nombre', data.nombre);
    body.append('fechaNacimiento', data.fechaNacimiento);
    body.append('genero', data.genero);
    body.append('invitadoPor', data.quienLoInvito);
    body.append('barrio', data.barrio);
    body.append('direccion', data.direccion);
    body.append('correo', data.correo);
    body.append('id_red', data.redPerteneciente);

    body.append('recUserId', this.userDb$.id);
    body.append('updtUserId', this.userDb$.id);

    body.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    const reqResp = this.http.post(url, body);
    const response: any = await lastValueFrom(reqResp);

    console.log("actualizarUsuarioInfo =>", response);
    this.dialogRef.componentInstance.close();
    return response.action;
  }

}
