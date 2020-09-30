const express = require('express');
const app = express();

const redis = require('redis')
/* Values are hard-coded for this example, it's usually best to bring these in via file or environment variable for production */
const client = redis.createClient({
  port: process.env.PORT || 6379,
  host: process.env.HOST || 'localhost',
  password: process.env.PASSWORD || '',
})

app.get('/', (req, res) => {
  console.log('Hello world received a request.');

  const target = process.env.TARGET || 'World';

  const source = process.env.SOURCE || 'Nobody';

  res.send(`Hello ${target}, from ${source}!`);

});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('Hello world listening on port', port);
});
