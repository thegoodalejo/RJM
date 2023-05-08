import firebase from 'firebase/compat';
import ObjectWithReference from './objectWithReferenc';
import AfirmacionReporte from './afirmacionReporte';

export default interface DetalleReportesAfirmacionMiembro {
    listaDeReportes: firebase.firestore.DocumentReference[];
    objetosMostrables: ObjectWithReference<AfirmacionReporte>[];
}