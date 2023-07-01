import firebase from 'firebase/compat/app';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

import { Injectable, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription, lastValueFrom } from 'rxjs';

import DetalleAfirmador from 'src/app/models/detalleAfirmador';
import NuevoMiembro from 'src/app/models/nuevoMiembro';
import AfirmacionReporte from 'src/app/models/afirmacionReporte';
import ObjectWithReference from 'src/app/models/objectWithReferenc';
import DetalleReportesAfirmacionMiembro from 'src/app/models/detalleReportesAfirmacionMiembro';
import UserDb from 'src/app/models/userDb';
import { AppDataService } from '../app-data.service';
import { LoadingModalComponent } from 'src/app/components/loading-modal/loading-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  @ViewChild(LoadingModalComponent)
  loadingModal!: LoadingModalComponent;

  userAuth$: any;
  userDb$: any;

  private subscriptionAuth: Subscription = new Subscription;
  private subscriptionDb: Subscription = new Subscription;

  constructor(
    private firestore: AngularFirestore,
    private snackBar: MatSnackBar,
    private appData: AppDataService,
    private dialog: MatDialog
  ) {
    this.subscriptionAuth = this.appData.userAuth$.subscribe(
      (userAuth) => {
        this.userAuth$ = userAuth;
        if (this.userAuth$) {
          const userRef = this.firestore.collection('usuarios').doc(this.userAuth$.uid);
          userRef.get().subscribe(resp => {
            if (resp.exists) {
              this.appData.updateUserDb(resp.data() as UserDb);
            } else {
              this.syncUserDb();
            }
          });
        }
      }
    );
    this.subscriptionDb = this.appData.userDb$.subscribe(
      (userDb) => {
        this.userDb$ = userDb;
      }
    );
  }

  async syncUserDb() {
    await this.createNewUserDb().then(() => {
      const userRef = this.firestore.collection('usuarios').doc(this.userAuth$.uid);
      userRef.get().subscribe(resp => {
        if (resp.exists) {
          this.userDb$ = resp;
          this.appData.updateUserDb(resp.data() as UserDb);
        }
      });
    });
  }

  async createNewUserDb() {
    const userRef = this.firestore.collection('usuarios').doc(this.userAuth$.uid);
    const data: UserDb = {
      onBoarding: false,
      lastConection: Date.now(),
      nombre: this.userAuth$.displayName,
      email: this.userAuth$.email,
      rol: ["Nuevo"],
      ministerio: '',
      ubicacion: '',
      posicion: '',
      listToCall: [],
      recordDate: Date.now(),
      updateDate: Date.now(),
      updateUser: this.userAuth$.displayName
    };

    await userRef.set(data).then(() => {
      console.log("Create response");
    }).catch(err => {
      console.log("Error => ", err);
    });
  }

  async createNewUser(user: any) {
    console.log("createNewUser");
    console.log("Current UID", user.uid);

    const userRef = this.firestore.collection('usuarios').doc(user.uid);
    const userDoc = userRef.get().subscribe(resp => {
      console.log("Respiesta oinicia", resp);
    });

    if (!userDoc) {
      const data: UserDb = {
        onBoarding: false,
        lastConection: Date.now(),
        nombre: user.displayName,
        email: user.email,
        rol: ["Nuevo"],
        ministerio: '',
        ubicacion: '',
        posicion: '',
        listToCall: [],
        recordDate: Date.now(),
        updateDate: Date.now(),
        updateUser: user.displayName
      };

      await userRef.set(data)
        .then((response) => {
          console.log('Creado Usuario ¡?¡?', response)
        })
        .catch(error => {
          console.log('Error al crear usuario:', error);
        });
    } else {
      console.log("El usuario ya existe");
    }
  }

  async onBoardingUpdate(data: any): Promise<boolean> {
    const dialogRef = this.dialog.open(LoadingModalComponent, {
      disableClose: true,
      panelClass: 'custom-modal-container' // Ajusta el nombre de la clase según tus estilos
    });
    dialogRef.componentInstance.open('loading');
    try {
      const documentRef = this.firestore.collection('usuarios').doc(this.userAuth$.uid);
      documentRef.update(data)
        .then(() => {
          dialogRef.componentInstance.update('success', "Actualizado exitosamente");
          this.appData.updateOnBoading(data);

          return true;
        })
        .catch(() => {
          dialogRef.componentInstance.update('failure', "Error al actualizar");
          return false;
        });
    } catch (error) {
      return false;
    }

    return false;
  }

  async getDocFromRef(docRef: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>) {
    const docSnap = await getDoc(docRef);
    return docSnap;
  }

  async getDocumentsFromCollection() {
    try {
      const colRef = collection(this.firestore.firestore, "miembros");
      const querySnapshot = await getDocs(collection(this.firestore.firestore, 'miembros'));
      return querySnapshot;
    } catch (error) {
      console.error('Error fetching documents:', error);
      return [];
    }
  }

  getTimeStamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  async getMembreciaList() {
    const colRef = collection(this.firestore.firestore, "miembros");
    const docSnap = await getDocs(colRef);
    return docSnap;
  }

  async getGobiernoList() {
    const colRef = collection(this.firestore.firestore, "usuarios");
    const docSnap = await getDocs(colRef);
    return docSnap;
  }

  async getAfirmacionReportSingle(uid: any) {
    const colRef = collection(this.firestore.firestore, "miembros");
    const docSnap = await getDocs(colRef);
    return docSnap;
  }

  async getUserDbInfo(uid: any) {
    const docRef = doc(this.firestore.firestore, "usuarios", uid);
    const docSnap = await getDoc(docRef) as any;

    if (!docSnap.data()) {
      console.log("Ups necesitamos crear usuario=");
    }

    console.log("UID:", uid);
    console.log("Document:", docSnap.data());

    return docSnap.data() as UserDb;
  }

  async crearNuevoMiembro(data: NuevoMiembro): Promise<boolean> {
    data.recordUser = this.userAuth$.displayName;
    data.updateUser = this.userAuth$.displayName;
    const dialogRef = this.dialog.open(LoadingModalComponent, {
      disableClose: true,
      panelClass: 'custom-modal-container' // Ajusta el nombre de la clase según tus estilos
    });

    dialogRef.componentInstance.open('loading');
    const dbRef  = this.userDb$.ministerio + this.userDb$.ubicacion;
    try {
      const miembrosRef = this.firestore.collection(dbRef + 'Miembros');
      await miembrosRef.add(data);
      dialogRef.componentInstance.update('success', "Creado exitosamente");
      return true;
    } catch (error) {
      dialogRef.componentInstance.update('failure', "No se pudo crear el usuario");
      return false;
    }
  }

  async createNewAfirmacionRecord(data: AfirmacionReporte) {
    console.log("New doc data: => ", data);

    const historialReporteRef = this.firestore.collection<AfirmacionReporte>('historialAfirmacion');
    const nuevoReporteRef = historialReporteRef.doc();
    const nuevoReporte: AfirmacionReporte = data;

    const miembroDocRef = this.firestore.doc(data.personaRef);

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
    await this.firestore.firestore.runTransaction(transaccion).then(
      () => {
        this.snackBar.open('Reporte creado correctamente', 'Cerrar',
          {
            duration: 3000
          }
        );
        //return true;
      })
      .catch(error => {
        this.snackBar.open('No se pudo crear el reporte', 'Cerrar', {
          duration: 3000
        });
        console.log(error);
        // return false;
      });
  }


  createDoc(data: any, path: string, id: string) {
    const collection = this.firestore.collection(path);
    return collection.doc(id).set(data);
  }

  async getListToCall(uid: any) {
    console.log('coleccion de afirmacion aaaaaaaaaaaaaaaaaa');

    const docRef = doc(this.firestore.firestore, "afirmacion", uid);
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

    const docRef = doc(this.firestore.firestore, "afirmacion", uid);
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

    const docRef = doc(this.firestore.firestore, "miembros", uid);
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
