require('dotenv').config();
const express = require('express');
const userApi = require('./src/routes/auth');
const menuApi = require('./src/routes/menuRoutes');
const companyApi = require('./src/routes/company');
const paymentApi = require('./src/routes/payment.routes');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(express.json());
const port = 8087;

const cors = require('cors');

app.use(cors({ origin: 'http://localhost:5173' }));
app.use('/auth', userApi);
app.use('/menu', menuApi);
app.use('/company', companyApi);
app.use('/payment', paymentApi);

app.listen(port, (err) => {
  if (err) {
    console.log(`Server not started at http://localhost:${port}`);
  } else {
    console.log(`Server started at http://localhost:${port}`);
  }
});