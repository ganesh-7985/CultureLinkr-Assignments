const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/api/products/value', (req, res) => {
  const products = req.body.products;

  if (!products || !Array.isArray(products)) {
    return res.status(400).json({ error: 'Invalid product list' });
  }

  let totalValue = 0;
  products.forEach((product) => {
    const { price, quantity } = product;
    if (price && quantity && typeof price === 'number' && typeof quantity === 'number') {
      totalValue += price * quantity;
    } else {
      return res.status(400).json({ error: 'Invalid product data' });
    }
  });

  res.json({ totalValue });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
