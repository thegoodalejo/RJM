import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { collection, getDocs, doc, getDoc, addDoc } from "firebase/firestore";
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, lastValueFrom } from 'rxjs';
import { forkJoin } from 'rxjs';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { runTransaction } from "firebase/firestore";

import ToAfirm from 'src/app/models/afirmacionList';
import DetalleAfirmador from 'src/app/models/detalleAfirmador';
import NuevoMiembro from 'src/app/models/nuevoMiembro';
import AfirmacionReporte from 'src/app/models/afirmacionReporte';
import ObjectWithReference from 'src/app/models/objectWithReferenc';


import firebase from 'firebase/compat/app';
import DetalleReportesAfirmacionMiembro from 'src/app/models/detalleReportesAfirmacionMiembro';
import UserDb from 'src/app/models/userDb';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  

  constructor(
    private _firestore: AngularFirestore,
    private _snackBar: MatSnackBar,
  ) { }

  getTimeStamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  async getMembreciaList() {
    const colRef = collection(this._firestore.firestore,"miembros");
    const docSnap = await getDocs(colRef);
  return docSnap;
  }

  async getAfirmacionReportSingle(uid:any) {
    const colRef = collection(this._firestore.firestore,"miembros");
    const docSnap = await getDocs(colRef);
  return docSnap;
  }

  async getUserDbInfo(uid: any) {
    const docRef = doc(this._firestore.firestore, "usuarios", uid);
    const docSnap = await getDoc(docRef) as any;

    console.log("Document data:", docSnap.data());
    return docSnap.data() as UserDb;
  }

  async createNewUser(user: any) {
    console.log("Creando usuario ?????????", user.uid);
    try {

    } catch (error) {

    }
    const userRef = this._firestore.collection('usuarios').doc(user.uid);
    const userDoc = await lastValueFrom(userRef.get());

    if (!userDoc.exists) {
      console.log("actualmente usuario no existe");
      const data: UserDb = {
        nombre: user.displayName,
        email: user.email,
        rol: ["Nuevo"],
        ministerio: '',
        ubicacion: '',
        posicion: ''
      };

      await userRef.set(data)
        .then(() => console.log('Usuario creado correctamente'))
        .catch(error => console.log('Error al crear usuario:', error));
    } else {
      console.log("El usuario ya existe");
    }
  }

  async crearNuevoMiembro(data: NuevoMiembro) {
    console.log("Creando nuevo miembro ?????????", data);
    const miembrosRef = this._firestore.collection('miembros');
    await miembrosRef.add(data)
      .then(
        () => {
          this._snackBar.open('Usuario creado correctamente', 'Cerrar',
            {
              duration: 3000
            }
          );
          //return true;
        })
      .catch(error => {
        this._snackBar.open('No se pudo crear el usuario', 'Cerrar', {
          duration: 3000
        });
        // return false;
      });
  }

  async createNewAfirmacionRecord(data: AfirmacionReporte) {
    console.log("New doc data: => ", data);

    const historialReporteRef = this._firestore.collection<AfirmacionReporte>('historialAfirmacion');
    const nuevoReporteRef = historialReporteRef.doc();
    const nuevoReporte: AfirmacionReporte = data;

    const miembroDocRef = this._firestore.doc(data.personaRef);

    const transaccion = async (transaction: firebase.firestore.Transaction): Promise<void> => {
      // retorno el obj miembro
      const miembroDoc = await transaction.get(miembroDocRef.ref);
      // retorno el array del obj miembro
      const historialAfirmacion: firebase.firestore.DocumentReference[] = miembroDoc.get('historialAfirmacion') || []; // si es nulo, inicializarlo como un array vacío
      // creo el nuevo reporte de afirmacion
      transaction.set(nuevoReporteRef.ref, nuevoReporte);
      // agrego la referencia al array del obj miembro
      historialAfirmacion.push(nuevoReporteRef.ref);
      // actualizo la info de obj miembro
      transaction.update(miembroDocRef.ref, { historialAfirmacion: historialAfirmacion });
    };
    await this._firestore.firestore.runTransaction(transaccion).then(
      () => {
        this._snackBar.open('Reporte creado correctamente', 'Cerrar',
          {
            duration: 3000
          }
        );
        //return true;
      })
      .catch(error => {
        this._snackBar.open('No se pudo crear el reporte', 'Cerrar', {
          duration: 3000
        });
        console.log(error);
        // return false;
      });
  }


  createDoc(data: any, path: string, id: string) {
    const collection = this._firestore.collection(path);
    return collection.doc(id).set(data);
  }

  async getListToCall(uid: any) {
    console.log('coleccion de afirmacion aaaaaaaaaaaaaaaaaa');

    const docRef = doc(this._firestore.firestore, "afirmacion", uid);
    const docSnap = await getDoc(docRef) as any;

    if (docSnap.exists()) {

      console.log("Document data:", docSnap.data());
      return docSnap.data().listToCall;

    } else {
      // doc.data() will be undefined in this case
      console.log("No such document! para " + uid);
      return [''];
    }

  }

  async listaPersonasAfirmacion(uid: any): Promise<DetalleAfirmador> {

    const objetoPpal: DetalleAfirmador = {
      nombre: '',
      listToCall: [],
      objetosMostrables: []
    };

    console.log('nuevo servicio, retirnar lista de personas para afirmar');

    const docRef = doc(this._firestore.firestore, "afirmacion", uid);
    const docSnap = await getDoc(docRef) as any;
    objetoPpal.listToCall = docSnap.data().listToCall;
    objetoPpal.nombre = docSnap.data().nombre;

    console.log("Initial Data", docSnap.data());
    console.log(objetoPpal.listToCall);
    console.log(objetoPpal.nombre);

    for (const ref of objetoPpal.listToCall) {
      const docSnap = await getDoc(ref);
      const datosDoc = docSnap.data() as NuevoMiembro;
      const data: ObjectWithReference<NuevoMiembro> = {
        id: ref,
        objeto: datosDoc
      }
      // Agregar el objeto a la lista de objetos mostrables
      objetoPpal.objetosMostrables.push(data);
    }


    console.log("objectppal data mostrable", objetoPpal.objetosMostrables);

    return objetoPpal;
  }

  async listaReportesAfirmacion(uid: any): Promise<DetalleReportesAfirmacionMiembro> {

    const objetoPpal: DetalleReportesAfirmacionMiembro = {
      listaDeReportes: [],
      objetosMostrables: []
    };

    console.log('Servicio: Retornar reportes de afirmacion x miembro', uid);

    const docRef = doc(this._firestore.firestore, "miembros", uid);
    console.log("Referencia", docRef);
    const docSnap = await getDoc(docRef) as any;
    console.log("Initial Data", docSnap.data());

    objetoPpal.listaDeReportes = docSnap.data().historialAfirmacion;

    console.log("Initial Data", docSnap.data());
    console.log(objetoPpal.listaDeReportes);

    for (const ref of objetoPpal.listaDeReportes) {
      const docSnap = await getDoc(ref);
      const datosDoc = docSnap.data() as AfirmacionReporte;
      const data: ObjectWithReference<AfirmacionReporte> = {
        id: ref,
        objeto: datosDoc
      }
      // Agregar el objeto a la lista de objetos mostrables
      objetoPpal.objetosMostrables.push(data);
    }


    console.log("objectppal data mostrable afirmacion x Miembro", objetoPpal.objetosMostrables);

    return objetoPpal;
  }

}
