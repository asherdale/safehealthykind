const firebase = require('firebase-admin');

firebase.initializeApp({
  credential: firebase.credential.applicationDefault()
});

const db = firebase.firestore();

const getScenarioData = async () => {
  try {
    const scenarioSnapshot = await db.collection('scenarios').orderBy('dateCreated', 'desc').limit(5).get();
    
    const scenarioToResponses = {};
    const scenarioData = scenarioSnapshot.docs.map(doc => {
      const scenario = {
        id: doc.id,
        responses: [],
        ...doc.data(),
      };

      scenarioToResponses[scenario.id] = scenario.responses;
      return scenario;
    });

    const scenarioIds = Object.keys(scenarioToResponses);
    
    const responseSnapshot = await db.collectionGroup('responses').where('scenarioId', 'in', scenarioIds).get();
    responseSnapshot.docs.forEach(doc => {
      const response = { id: doc.id, ...doc.data() };
      (scenarioToResponses[response.scenarioId] || []).push(response);
    });

    return scenarioData;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const updateScenario = async (scenarioId, update) => {
  try {
    await db.collection('scenarios').doc(scenarioId).set(update, { merge: true });
    return true;
  } catch (error) {
    console.log(error);
    return false;
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
    console.log(error);
    return false;
  }
};

const updateResponse = async (scenarioId, responseId, update) => {
  try {
    await db.collection('scenarios').doc(scenarioId).collection('responses').doc(responseId).set(update, { merge: true });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const addResponse = async (scenarioId, name, location, responseText) => {
  const response = {
    likes: 0,
    reports: 0,
    dateCreated: firebase.firestore.FieldValue.serverTimestamp(),
    scenarioId,
    name,
    location,
    responseText,
  };

  try {
    await db.collection('scenarios').doc(scenarioId).collection('responses').doc().set(response);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = {
  getScenarioData,
  updateResponse,
  addResponse,
  updateScenario,
  addScenario
};
