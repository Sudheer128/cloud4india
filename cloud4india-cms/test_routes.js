const express = require('express');
const app = express();
app.get('/test-solutions', (req, res) => {
  res.json({ message: 'Test route works', timestamp: new Date().toISOString() });
});
app.listen(4003, () => {
  console.log('Test server on 4003');
  setTimeout(() => {
    const http = require('http');
    http.get('http://localhost:4003/test-solutions', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('Response:', data);
        process.exit(0);
      });
    });
  }, 1000);
});
