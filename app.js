const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const scenarioRoutes = require('./routes/scenarioRoutes');
const responseRoutes = require('./routes/responseRoutes');

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "/client/build")));

app.use("/api/scenario", scenarioRoutes);
app.use("/api/response", responseRoutes);

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/build/index.html"));
});

app.use((err, req, res, next) => {
  res.status(422).send({ error: err._message });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
