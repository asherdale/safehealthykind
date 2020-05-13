const express = require("express");
const { getScenarioData, addScenario, updateScenario } = require('../api/firebase');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const scenarios = await getScenarioData();
    res.status(200).send({ scenarios });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, title, scenarioText } = req.body;
    const isAdded = await addScenario(name, title, scenarioText);
    res.status(200).send({ isAdded });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put('/', async (req, res, next) => {
  try {
    const { scenarioId, update } = req.body;
    const isAdded = await updateScenario(scenarioId, update);
    res.status(200).send({ isAdded });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
