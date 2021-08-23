import firebase from "firebase/app";
import "firebase/firestore";

var firebaseConfig = {
  apiKey: "AIzaSyDToRLNrsG34P7gDS26DbevgQbaSWxgGUc",
  authDomain: "weatherapp-d481c.firebaseapp.com",
  projectId: "weatherapp-d481c",
  storageBucket: "weatherapp-d481c.appspot.com",
  messagingSenderId: "969774359517",
  appId: "1:969774359517:web:7e8f1302bc1047a2b90c34"
};
// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
export default firebaseApp.firestore();