import firebase from 'firebase/compat';

export default interface NuevoMiembro {
    id?: any;

    nombre: string; // Obligatorio
    telefono: string; // Obligatorio
    fechaNacimiento: any // Obligatorio
    genero: string; // Obligatorio
    quienLoInvito: string; // Obligatorio

    barrio: string; // Obligatorio
    direccion: string; // Opcional
    correo: string; // Opcional
    redPerteneciente: string; // Opcional

    historialAfirmacion: firebase.firestore.DocumentReference[];

    recordDate: any;
    recordUser: any;
    updateDate: any;
    updateUser: any;
    
}