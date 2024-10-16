import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';


const firebaseConfig = {
  // Configuración de Firebase de tu aplicación  
  apiKey: "AIzaSyAvKEzf5hyVpODJ4NSJ57sdbENsFEB-sKA",
  authDomain: "appvue-nombre-ap.firebaseapp.com",
  databaseURL: "https://appvue-nombre-ap-default-rtdb.firebaseio.com",
  projectId: "appvue-nombre-ap",
  storageBucket: "appvue-nombre-ap.appspot.com",
  messagingSenderId: "649339084006",
  appId: "1:649339084006:web:93030354d27d39c5886f27",
  measurementId: "G-8RDBK31DMN"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();

export { firebase, db, firebaseConfig, auth };

const firestore = firebase.firestore();
