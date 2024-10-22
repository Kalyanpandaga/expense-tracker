require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const { sequelize } = require('./models');

const app = express();
app.use(bodyParser.json());

app.use('/api', authRoutes);
app.use('/api', transactionRoutes);

console.log(process.env.PORT)

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});