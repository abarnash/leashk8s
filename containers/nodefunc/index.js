const express = require('express');
const app = express();

const redis = require('redis')
const uuid = require('uuid')

const asyncRedis = require("async-redis");

/* Values are hard-coded for this example, it's usually best to bring these in via file or environment variable for production */
const client = redis.createClient({
  port: process.env.REDIS_LEADER_SERVICE_PORT || 6379,
  host: process.env.REDIS_LEADER_SERVICE_HOST || 'localhost',
  // password: process.env.PASSWORD || '',
})

const asyncRedisClient = asyncRedis.decorate(client);

client.on("error", function(error) {
  console.error(error);
});

app.post('/key', (req, res) => {
  console.log('Hello world received a post request');


  client.set("key", uuid.v4())

  res.send('Success')
})

app.get('/key', async (req, res) => {
  console.log('Hello world received a get request');
  const value = await asyncRedisClient.get("key");
  console.log(value);
  res.send(value)
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
