import firebase from 'firebase/compat';
import NuevoMiembro from './nuevoMiembro';
import ObjectWithReference from './objectWithReferenc';

export default interface DetalleAfirmador {
    listToCall: firebase.firestore.DocumentReference[];
    nombre: string;
    objetosMostrables: ObjectWithReference<NuevoMiembro>[];
}