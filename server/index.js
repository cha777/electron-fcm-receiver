const admin = require('firebase-admin');
const express = require('express');

const path = require('path');

const configPath = path.resolve(__dirname, 'firebase-config.json');
const serviceAccount = require(configPath);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = 9898;

const tokens = [];

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const payload = {
  notification: {
    title: 'FCM IS COOL !',
    body: 'Notification has been recieved',
    content_available: 'true',
    image: 'https://i.ytimg.com/vi/iosNuIdQoy8/maxresdefault.jpg',
  },
};

const options = {
  priority: 'high',
};

app.listen(port, '127.0.0.1', () => {
  console.log(`Express server started on port ${port}`);
});

app.get('/', (req, res) => {
  res.send('express service running');
});

app.get('/notification/sendToSpecific', (_, res) => {
  console.log('tokens', tokens);

  admin
    .messaging()
    .sendToDevice(tokens, payload, options)
    .then(() => {
      res.status(200).send('message successfully sent !');
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

app.post('/notification/register', (req, res) => {
  const { token, pdm } = req.body;
  tokens.push(token);
  res.status(200).send('registered successfully !');
});
