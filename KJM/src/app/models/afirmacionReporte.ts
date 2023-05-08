import firebase from 'firebase/compat';

export default interface AfirmacionReporte {

    personaRef: firebase.firestore.DocumentReference;
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
