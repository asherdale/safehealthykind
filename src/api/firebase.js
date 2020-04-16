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
  try {
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

    const responseSnapshot = await db.collectionGroup('responses').where('reports', '<', 3).get();
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
  } catch (error) {
    return null;
  }
};

export const updateResponse = async (response, update) => {
  try {
    await db.collection('scenarios').doc(response.scenarioRef.id).collection('responses').doc(response.id).set(update, { merge: true });
    return true;
  } catch (error) {
    return false;
  }
};

export const addResponse = async (scenario, name, location, responseText) => {
  const response = {
    likes: 0,
    reports: 0,
    dateCreated: firebase.firestore.FieldValue.serverTimestamp(),
    scenarioRef: db.collection('scenarios').doc(scenario.id),
    name,
    location,
    responseText,
  };

  try {
    await db.collection('scenarios').doc(scenario.id).collection('responses').doc().set(response);
    return true;
  } catch (error) {
    return false;
  }
};
