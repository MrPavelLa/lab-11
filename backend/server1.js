const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const ratingRoutes = require('./routes/transactionRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

mongoose.connect('mongodb://localhost:27017/myDatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(express.json());
app.use('/transactions', ratingRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
