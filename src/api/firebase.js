// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/analytics";
import "firebase/firestore";

import { firebaseConfig } from '../config/keys';

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();;

export const analytics = firebase.analytics();

export const getScenarioData = async () => {
  const snapshot = await db.collection('scenarios').get();

  const data = snapshot.docs.map(doc => ({
    id: doc.id,
    data: doc.data()
  }));

  return data;
};
