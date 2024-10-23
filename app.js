require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const { sequelize } = require('./models');

const app = express();
app.use(bodyParser.json());

// Enable CORS
app.use(cors());

app.use('', authRoutes);
app.use('', transactionRoutes);

console.log(process.env.PORT)

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});