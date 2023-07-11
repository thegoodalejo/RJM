import firebase from 'firebase/compat';

export default interface UserDb {
    id: number;

    id_ministerio: number;
    id_sede: number;

    id_firebaseRef: any;

    displayName: string;
    email: string;
    numeroTelefonico: string;

    activo: boolean;
    onBoarding: number;

    recDate: any;
    rol: string;
    
}
