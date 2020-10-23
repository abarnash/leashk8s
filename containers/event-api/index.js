const express = require('express');
const app = express();
const axios = require('axios')

app.post('/hello', async (req, res, next) => {
  console.log(process.env.BROKER_HOST, process.env.BROKER_PATH)

  // curl -v "http://broker-ingress.knative-eventing.svc.cluster.local/event-example/default" \
  // -X POST \
  // -H "Ce-Id: say-hello" \
  // -H "Ce-Specversion: 1.0" \
  // -H "Ce-Type: greeting" \
  // -H "Ce-Source: not-sendoff" \
  // -H "Content-Type: application/json" \
  // -d '{"msg":"Hello Knative!"}'
  var options = {
    url: `${process.env.BROKER_HOST}/${process.env.BROKER_PATH}`,
    method: 'POST',
    headers: {
      "Ce-Id": "say-hello",
      "Ce-Specversion": "1.0",
      "Ce-Type": "greeting",
      "Ce-Source": "not-sendoff",
      "Content-Type": "application/json"
    },
    data: {
      msg: "Hello, Knative!"
    }
  }

  try {
    const {statusText} = await axios(options)
    res.json({statusText})
  }
  catch (err) {
    next(err)
  }

})

app.post('/goodbye', async (req, res) => {


  // curl -v "http://broker-ingress.knative-eventing.svc.cluster.local/event-example/default" \
  // -X POST \
  // -H "Ce-Id: say-goodbye" \
  // -H "Ce-Specversion: 1.0" \
  // -H "Ce-Type: not-greeting" \
  // -H "Ce-Source: sendoff" \
  // -H "Content-Type: application/json" \
  // -d '{"msg":"Goodbye Knative!"}'
  var options = {
    url: `${process.env.BROKER_HOST}/${process.env.BROKER_PATH}`,
    method: 'POST',
    headers: {
      "Ce-Id": "say-goodbye",
      "Ce-Specversion": "1.0",
      "Ce-Type": "not-greeting",
      "Ce-Source": "sendoff",
      "Content-Type": "application/json"
    },
    data: {
      msg: "Goodbye, Knative!"
    }
  }

  try {
    const {statusText} = await axios(options)
    res.json({statusText})
  }
  catch (err) {
    next(err)
  }

})

app.post('/aloha', async (req, res) => {


  // curl -v "http://broker-ingress.knative-eventing.svc.cluster.local/event-example/default" \
  // -X POST \
  // -H "Ce-Id: say-hello-goodbye" \
  // -H "Ce-Specversion: 1.0" \
  // -H "Ce-Type: greeting" \
  // -H "Ce-Source: sendoff" \
  // -H "Content-Type: application/json" \
  // -d '{"msg":"Hello Knative! Goodbye Knative!"}'
  var options = {
    url: `${process.env.BROKER_HOST}/${process.env.BROKER_PATH}`,
    method: 'POST',
    headers: {
      "Ce-Id": "say-aloha",
      "Ce-Specversion": "1.0",
      "Ce-Type": "greeting",
      "Ce-Source": "sendoff",
      "Content-Type": "application/json"
    },
    data: {
      msg: "Aloha, Knative!"
    }
  }

  try {
    const {statusText} = await axios(options)
    res.json({statusText})
  }
  catch (err) {
    next(err)
  }

})

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('Hello world listening on port', port);
});
