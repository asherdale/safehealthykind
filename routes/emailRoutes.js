const express = require("express");
const mailgun = require("mailgun-js");
const { mailgunDomain, mailgunApiKey, mailgunSender, mailgunReceiver } = require("../config/keys");

const router = express.Router();

const mg = mailgun({apiKey: mailgunApiKey, domain: mailgunDomain});

router.post('/', async (req, res, next) => {
  try {
    const { sender, subject, text } = req.body;

    const data = {
      from: mailgunSender,
      to: mailgunReceiver,
      subject,
      text: `${text}\n\nSender email is ${sender}`,
    };
    
    await mg.messages().send(data);

    res.status(200).send({});
  } catch (error) {
    console.log('ERROR: POST /api/email', error);
    res.status(500).json(error);
  }
});

module.exports = router;
