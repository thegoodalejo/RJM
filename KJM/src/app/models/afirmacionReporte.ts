import firebase from 'firebase/compat';

export default interface AfirmacionReporte {

    id?: any;
    ref?: firebase.firestore.DocumentReference;

    personaRef: firebase.firestore.DocumentReference;
    personaNombre: string;
    afirmador: string;
    afirmadorID: any;
    fechaReporte: any;

    personaContesta: boolean;

    //novedades
    personaNoContesta: boolean;
    noContestaSeDejaMensaje: boolean;
    personaNumeroIncorrecto: boolean;
    personaFueraDeLaCiudad: boolean;
    personaOtraIglesia: boolean;

    //si contesta, entonces
    personaInteresada: boolean;
    personaAsistira: boolean
    personaPideOracion: boolean;

    //para el step 3
    reporteOracion: string;
    reporteGeneral: string;

    registroDate: any;
}
