const app = require('./app');

const PORT =  3002;
app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});