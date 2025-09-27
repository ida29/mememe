const https = require('https');

console.log('Fetching card data from GitHub Pages...\n');

const url = 'https://ida29.github.io/mememe/data/mememe_cards_complete.json';

https.get(url, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log(`Status Message: ${res.statusMessage}`);
  console.log('Headers:', res.headers);

  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const cards = JSON.parse(data);
      console.log('\n=== JSON Parse Success ===');
      console.log(`Total cards: ${cards.length}`);
      if (cards.length > 0) {
        console.log('First card:', cards[0]);
        console.log('Card fields:', Object.keys(cards[0]));
      }
    } catch (error) {
      console.log('\n=== JSON Parse Error ===');
      console.log(error.message);
      console.log('Raw data (first 500 chars):', data.substring(0, 500));
    }
  });
}).on('error', (err) => {
  console.error('Request Error:', err);
});