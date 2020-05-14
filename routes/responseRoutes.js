const express = require("express");
const { updateResponse, addResponse } = require('../api/firebase');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { scenarioId, name, location, responseText } = req.body;
    const isAdded = await addResponse(scenarioId, name, location, responseText);
    res.status(200).send({ isAdded });
  } catch (error) {
    console.log('ERROR: POST /api/response', error);
    res.status(500).json(error);
  }
});

router.put('/', async (req, res, next) => {
  try {
    const { scenarioId, responseId, update } = req.body;
    const isAdded = await updateResponse(scenarioId, responseId, update);
    res.status(200).send({ isAdded });
  } catch (error) {
    console.log('ERROR: PUT /api/response', error);
    res.status(500).json(error);
  }
});

module.exports = router;
