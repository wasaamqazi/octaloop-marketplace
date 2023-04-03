// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useHistory } from "react-router-dom";
import { getStorage } from "firebase/storage";
import { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { ToastContainer, toast } from "react-toastify";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyC54DYZ5MMPm3a3Z43igwoxvR6IEen0cyA",
  authDomain: "smashnft-45a85.firebaseapp.com",
  projectId: "smashnft-45a85",
  storageBucket: "smashnft-45a85.appspot.com",
  messagingSenderId: "59862293272",
  appId: "1:59862293272:web:cbefc8443130780ed8dc6d",
  measurementId: "G-TR1C3BCL0R",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getDatabase(app);
const firestoredb = getFirestore(app);
// const currentUsera = "";

onAuthStateChanged(auth, (currentUser) => {
  if (currentUser) {
    console.log("logged in " + currentUser.displayName);
    // setAbc(currentUser.displayName);
  } else {
    console.log("logged out");
  }
});

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState();
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => setCurrentUser(user));
    return unsub;
  }, []);
  return currentUser;
};

export const uploadImg = async (image, currentUser) => {
  // const currentUser = useAuth();
  const imageRef = ref(storage, currentUser.uid + "image");
  const snapshot = await uploadBytes(imageRef, image);

  const photoURL = await getDownloadURL(imageRef);
  updateProfile(currentUser, { photoURL });
  toast("Profile uploaded succesfully");
  // window.location.reload();
};


// export const RegisterFb = () => {
//   // const history = useHistory();
//   const provider = new FacebookAuthProvider();

//   signInWithPopup(auth, provider)
//     .then((re) => {
//       // history.push("/");
//     })

//     .catch((err) => {
//       console.log(err.message);
//     })
// }
// const analytics = getAnalytics(app);

export { auth, app, storage, db, firestoredb };
