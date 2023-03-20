import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(
    private firestore: AngularFirestore
  ) { }

  createDoc(data: any, path: string, id: string){
    const collection = this.firestore.collection(path);
    return collection.doc(id).set(data);
  }
  getCollection(){
    console.log('coleccion de usuarios');

    this.firestore.collection('users').valueChanges().subscribe(
      (res) => {
        console.log('res => ', res)
      }
    )
  }
}
