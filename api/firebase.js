const firebase = require('firebase-admin');

firebase.initializeApp({
  credential: firebase.credential.applicationDefault()
});

const db = firebase.firestore();

const getScenarioFeed = async (lastDate) => {
  try {
    const date = lastDate ? new Date(lastDate * 1000) : Date();

    const scenarioSnapshot = await db.collection('scenarios')
      .orderBy('dateCreated', 'desc')
      .startAfter(date)
      .limit(10)
      .get();
    
    const scenarioToResponses = {};
    const scenarioData = scenarioSnapshot.docs.map(doc => {
      const scenario = {
        id: doc.id,
        responses: [],
        ...doc.data(),
      };

      if (scenario.reports >= 3) {
        return null;
      }

      scenarioToResponses[scenario.id] = scenario.responses;

      return scenario;
    });

    const scenarioIds = Object.keys(scenarioToResponses);

    if (scenarioIds.length == 0) {
      return [];
    }
    
    const responseSnapshot = await db.collectionGroup('responses')
      .where('scenarioId', 'in', scenarioIds)
      .where('reports', '<', 3)
      .get();

    responseSnapshot.docs.forEach(doc => {
      const response = { id: doc.id, ...doc.data() };
      (scenarioToResponses[response.scenarioId] || []).push(response);
    });

    return scenarioData.filter(s => s);
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getScenario = async (scenarioId) => {
  try {
    const scenarioSnapshot = await db.collection('scenarios').doc(scenarioId).get();
    const scenario = {
      id: scenarioSnapshot.id,
      responses: [],
      ...scenarioSnapshot.data()
    };

    if (!scenario.scenarioText) {
      return null;
    }
    
    const responseSnapshot = await db.collectionGroup('responses').where('scenarioId', '==', scenarioId).where('reports', '<', 3).get();
    responseSnapshot.docs.forEach(doc => {
      const response = { id: doc.id, ...doc.data() };
      scenario.responses.push(response);
    });

    return [scenario];
  } catch (error) {
    console.log(error);
    return null;
  }
}

const updateScenario = async (scenarioId, update) => {
  try {
    await db.collection('scenarios').doc(scenarioId).set(update, { merge: true });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const addScenario = async (name, title, location, scenarioText) => {
  const scenario = {
    reports: 0,
    likes: 0,
    dateCreated: firebase.firestore.FieldValue.serverTimestamp(),
    name,
    title,
    location,
    scenarioText,
  };

  try {
    const docRef = await db.collection('scenarios').add(scenario);
    return docRef && docRef.id;
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

const addResponse = async (scenarioId, name, location, title, responseText) => {
  const response = {
    reports: 0,
    likes: 0,
    dateCreated: firebase.firestore.FieldValue.serverTimestamp(),
    scenarioId,
    name,
    location,
    title,
    responseText,
  };

  try {
    const docRef = await db.collection('scenarios').doc(scenarioId).collection('responses').add(response);
    return docRef && docRef.id;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = {
  getScenarioFeed,
  getScenario,
  updateResponse,
  addResponse,
  updateScenario,
  addScenario
};
