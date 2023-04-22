import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { collection, getDocs, doc, getDoc, addDoc } from "firebase/firestore";
import { MatSnackBar } from '@angular/material/snack-bar';
import { lastValueFrom } from 'rxjs';
import ToAfirm from 'src/app/models/afirmacionList';
import NuevoMiembro from 'src/app/models/nuevoMiembro';


@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(
    private _firestore: AngularFirestore,
    private _snackBar: MatSnackBar,
  ) { }

  async createNewUser(user: any) {
    console.log("Creando usuario ?????????", user.uid);
    try {

    } catch (error) {

    }
    const userRef = this._firestore.collection('usuarios').doc(user.uid);
    const userDoc = await lastValueFrom(userRef.get());

    if (!userDoc.exists) {
      console.log("actualmente usuario no existe");
      const data = {
        nombre: user.displayName,
        email: user.email,
        rol: "Nuevo"
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

  async createNewAfirmacionRecord(data: ToAfirm) {
    console.log("New doc data: => ", data);
    const afirmacionRef = collection(this._firestore.firestore, "afirmacionHistorial");
    if (await addDoc(afirmacionRef, data)) {
      alert("Enviado...");
    }

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

  async listaPersonasAfirmacion(uid: any){

    console.log('nuevo servicio, retirnar lista de personas para afirmar');

    const docRef = doc(this._firestore.firestore, "afirmacion", uid);
    const docSnap = await getDoc(docRef) as any;
    const references = docSnap.data().listToCall;

    console.log(references);

    /*const referencedObjects = await Promise.all(references.map(async (reference: { id: any; }) => {
      const collectionRef = collection(this._firestore.firestore, 'otraColeccion');
      const query = query(collectionRef, where('id', '==', reference.id));
      const querySnapshot = await getDocs(query);
      const documents = querySnapshot.docs.map(doc => doc.data());*/
  }

}
