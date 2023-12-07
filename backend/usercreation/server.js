const app = require('./app');

const PORT =  3001;
app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});
