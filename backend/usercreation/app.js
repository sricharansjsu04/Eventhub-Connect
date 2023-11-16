const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');

const app = express();

const cors = require('cors');
app.use(cors());

app.use(bodyParser.json());
app.use('/users', userRoutes);

module.exports = app;
