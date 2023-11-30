const envConfig = require('dotenv').config();

if (envConfig.error) {
  throw envConfig.error;
}

console.log(envConfig.parsed);
const app = require('./app');

const PORT =  3002;
app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});