
const express = require('express');
const bodyParser = require('body-parser');
const statusRoutes = require('./routes/statusRoutes');

const app = express();

const cors = require('cors');
app.use(cors());

app.use(bodyParser.json());
app.use('/playarea-status', statusRoutes);

module.exports = app;


