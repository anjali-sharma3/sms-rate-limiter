require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const smsRoutes = require('./routes/smsRoutes');
const errorHandler = require('./utils/errorHandler');

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  methods: 'GET,POST',
  allowedHeaders: 'Content-Type,Authorization',
};

app.use(cors(corsOptions));

app.use(express.json()); 
app.use('/api/sms', smsRoutes); 
app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
