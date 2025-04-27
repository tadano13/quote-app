const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/quotesDB')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Connection error:', err));

// Quote model
const Quote = mongoose.model('Quote', new mongoose.Schema({
  text: String,
  author: String
}));

// Set view engine to EJS
app.set('view engine', 'ejs');

// Middleware
app.use(express.static('public'));

// Routes
app.get('/', async (req, res) => {
  const count = await Quote.countDocuments();
  res.render('index', { count });
});

app.get('/random-quote', async (req, res) => {
  try {
    // Get a random quote
    const count = await Quote.countDocuments();
    const random = Math.floor(Math.random() * count);
    const quote = await Quote.findOne().skip(random);
    
    if (!quote) {
      return res.status(404).json({ error: 'No quotes found' });
    }
    
    res.json(quote);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});