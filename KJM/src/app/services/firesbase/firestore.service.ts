import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { collection, getDocs, doc, getDoc, addDoc } from "firebase/firestore";
import { AuthService } from './auth.service';
import { Observable, lastValueFrom, map } from 'rxjs';
import ToAfirm from 'src/app/models/afirmacionList';


@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(
    private firestore: AngularFirestore,
    //private fireAuth: AuthService
  ) { }

  async createNewUser(user: any) {
    const userRef = this.firestore.collection('usuarios').doc(user.uid);
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

  async createNewAfirmacionRecord(data: ToAfirm) {
    console.log("New doc data: => ", data);
    const afirmacionRef = collection(this.firestore.firestore,"afirmacionHistorial");
    if(await addDoc(afirmacionRef,data))
    {
      alert("Enviado...");
    }

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
      /*let personas: any[] = ['']
      docSnap.data().listToCall.forEach((element: { nombre: any, telefono: any }) => {
        console.log("Nombre => " + element.nombre);
        console.log("Telefono => " + element.telefono);
        console.log("Objeto => " + element);
        personas.push(element)
      });*/

      return docSnap.data().listToCall;


    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
      return [''];
    }

  }

}
