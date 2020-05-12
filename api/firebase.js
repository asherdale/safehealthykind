const firebase = require('firebase-admin');

const isProd = process.env.NODE_ENV === 'production';
const databaseURL = isProd ? 'https://safehealthykind.firebaseio.com' : 'https://safehealthykind-dev.firebaseio.com';

firebase.initializeApp({
  credential: firebase.credential.applicationDefault(),
  databaseURL
});

const db = firebase.firestore();

const getScenarioData = async () => {
  try {
    const scenarioSnapshot = await db.collection('scenarios').orderBy('dateCreated', 'desc').get();

    const scenarioMap = {};
    const scenarioData = scenarioSnapshot.docs.map(doc => {
      const scenario = {
        id: doc.id,
        responses: [],
        ...doc.data(),
      };

      scenario.dateCreated = scenario.dateCreated.toDate();

      scenarioMap[scenario.id] = scenario;

      return scenario;
    });

    const responseSnapshot = await db.collectionGroup('responses').where('reports', '<', 2).get();
    responseSnapshot.docs.forEach(doc => {
      const response = {
        id: doc.id,
        ...doc.data(),
      };

      response.dateCreated = response.dateCreated.toDate();
      response.scenarioId = response.scenarioRef.id;

      if (response.scenarioRef.id in scenarioMap) {
        scenarioMap[response.scenarioRef.id].responses.push(response);
      }
    });

    return scenarioData;
  } catch (error) {
    return null;
  }
};

const addScenario = async (name, title, scenarioText) => {
  const scenario = {
    reports: 0,
    dateCreated: firebase.firestore.FieldValue.serverTimestamp(),
    name,
    title,
    scenarioText,
  };

  try {
    await db.collection('scenarios').doc().set(scenario);
    return true;
  } catch (error) {
    return false;
  }
};

const updateResponse = async (scenarioId, responseId, update) => {
  try {
    await db.collection('scenarios').doc(scenarioId).collection('responses').doc(responseId).set(update, { merge: true });
    return true;
  } catch (error) {
    return false;
  }
};

const addResponse = async (scenarioId, name, location, responseText) => {
  const response = {
    likes: 0,
    reports: 0,
    dateCreated: firebase.firestore.FieldValue.serverTimestamp(),
    scenarioRef: db.collection('scenarios').doc(scenarioId),
    name,
    location,
    responseText,
  };

  try {
    await db.collection('scenarios').doc(scenarioId).collection('responses').doc().set(response);
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = {
  getScenarioData,
  updateResponse,
  addResponse,
  addScenario
};
