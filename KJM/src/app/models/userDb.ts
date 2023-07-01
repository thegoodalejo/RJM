import firebase from 'firebase/compat';

export default interface UserDb {
    id?: any;

    onBoarding: boolean;
    lastConection: any;

    nombre: string;
    email: string;
    rol: string[];
    ministerio: string;
    ubicacion: string;
    posicion: string;
    listToCall: firebase.firestore.DocumentReference[];
    recordDate: any;
    updateDate: any;
    updateUser: any;
}
