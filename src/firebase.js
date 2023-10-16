import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDDQ2hFjJKrl5FuDM0Id7-ydIrill28yx0",
    authDomain: "instagram-clone-a147c.firebaseapp.com",
    projectId: "instagram-clone-a147c",
    storageBucket: "instagram-clone-a147c.appspot.com",
    messagingSenderId: "1048634702779",
    appId: "1:1048634702779:web:108835965423da15c7229e",
    measurementId: "G-9Y0S378WPW"
  };
// Use this to initialize the firebase App
const firebaseApp = firebase.initializeApp(firebaseConfig);

// Use these for db & auth
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { auth, db, storage };