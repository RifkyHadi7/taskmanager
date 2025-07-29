require('dotenv').config();
const app = require('./src/app');
const db = require('./src/config/db');

const PORT = process.env.PORT || 5000;

db().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
