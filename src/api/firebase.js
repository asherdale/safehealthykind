// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/analytics";
import "firebase/firestore";

import { firebaseConfig } from '../config/keys';

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();;

export const analytics = firebase.analytics();

// TODO wrap in try-catch and show error on fail
export const getScenarioData = async () => {
  const scenarioSnapshot = await db.collection('scenarios').get();

  const scenarioMap = {};
  const scenarioData = scenarioSnapshot.docs.map(doc => {
    const scenario = {
      id: doc.id,
      responses: [],
      ...doc.data(),
    };

    scenarioMap[scenario.id] = scenario;

    return scenario;
  });

  const responseSnapshot = await db.collectionGroup('responses').get(); //.where('reports', '<', '3')
  responseSnapshot.docs.forEach(doc => {
    const response = {
      id: doc.id,
      ...doc.data(),
    };

    if (response.scenarioRef.id in scenarioMap) {
      scenarioMap[response.scenarioRef.id].responses.push(response);
    }
  });

  return scenarioData;
};

export const updateResponse = async (response, update) => {
  await db.collection('scenarios').doc(response.scenarioRef.id).collection('responses').doc(response.id).set(update, { merge: true });
};