import  firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/database';
import 'firebase/analytics';

console.log(JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG));
firebase.initializeApp(JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG));

export default firebase;
