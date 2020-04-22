const express = require("express");
const { getScenarioData } = require('../api/firebase');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const scenarios = await getScenarioData();
    res.status(200).send({ scenarios });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
