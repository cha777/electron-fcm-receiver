const admin = require('firebase-admin');
const express = require('express');

const fs = require('fs');
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

const options = {
  priority: 'high',
};

app.listen(port, '127.0.0.1', () => {
  console.log(`Express server started on port ${port}`);
});

app.get('/', (req, res) => {
  res.send('express service running');
});

app.get('/notification/send-basic', (_, res) => {
  console.log('tokens', tokens);

  const payload = {
    notification: {
      title: 'Pro11 Plain Notification',
      body: 'You have got a basic notification',
    }
  }

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

app.get('/notification/send-advanced', async (_, res) => {
  console.log('tokens', tokens);

  const htmlContentPath = path.resolve(__dirname, '../html-notification/index.html');
  const htmlContent = await fs.promises.readFile(htmlContentPath, {encoding: 'utf-8'});

  const payload = {
    notification: {
      title: 'Pro11 HTML Notification',
      body: 'You have got a html notification',
    },
    data: {
      additionalContent: htmlContent
    }
  }

  admin
      .messaging()
      .sendToDevice(tokens, payload, options)
      .then(() => {
        res.status(200).send('message successfully sent !');
      })
      .catch((error) => {
        res.status(500).send(error);
      });
})

app.post('/notification/register', (req, res) => {
  const { token, pdm } = req.body;
  tokens.push(token);
  res.status(200).send('registered successfully !');
});
