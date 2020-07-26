const express = require("express");
const { getScenarioFeed, getScenario, addScenario, updateScenario } = require('../api/firebase');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const scenarios = req.query.id ? await getScenario(req.query.id) : await getScenarioFeed(req.query.lastDate);
    
    res.status(200).send({ scenarios });
  } catch (error) {
    console.log('ERROR: GET /api/scenario', error);
    res.status(500).json(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, title, location, scenarioText } = req.body;
    const docId = await addScenario(name, title, location, scenarioText);
    res.status(200).send({ docId, isAdded: !!docId });
  } catch (error) {
    console.log('ERROR: POST /api/scenario', error);
    res.status(500).json(error);
  }
});

router.put('/', async (req, res, next) => {
  try {
    const { scenarioId, update } = req.body;
    const isAdded = await updateScenario(scenarioId, update);
    res.status(200).send({ isAdded });
  } catch (error) {
    console.log('ERROR: PUT /api/scenario', error);
    res.status(500).json(error);
  }
});

module.exports = router;
