const express    = require('express');
const bodyParser = require('body-parser');
const cors       = require('cors');
const path       = require('path');
const data       = require('./data/data.js');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/api/products', (req, res) => {
  res.json(data.products);
});
app.get('/api/products/:id', (req, res) => {
  const id = +req.params.id;
  const product = data.products.find(p => p.id === id);
  if (!product) return res.status(404).json({ error: 'Not found' });
  res.json(product);
});

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'products.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
