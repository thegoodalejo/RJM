import firebase from 'firebase/compat';

export default interface NuevoMiembro {
    
    nombre: string; // Obligatorio
    telefono: string; // Obligatorio
    fechaNacimiento: string // Obligatorio
    genero: string; // Obligatorio
    quienLoInvito: string; // Obligatorio

    barrio: string; // Obligatorio
    direccion: string; // Opcional
    correo: string; // Opcional
    redPerteneciente: string; // Opcional

    historialAfirmacion: firebase.firestore.DocumentReference[];
    registroDate: any;
}