import firebase from 'firebase/compat';
import NuevoMiembro from './nuevoMiembro';

export default interface ObjectWithReference<T> {
    id: firebase.firestore.DocumentReference;
    objeto: T;
}