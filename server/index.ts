import express from 'express';
import admin from 'firebase-admin';
import 'dotenv/config'
import type { MulticastMessage } from 'firebase-admin/lib/messaging';
import path from 'path';
import fs from 'fs';

const port = Number(process.env.SERVER_PORT) || 9898;
const tokens: string[] = [];
const app = express();

app.use(express.json());

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
});

app.listen(port, '127.0.0.1', () => {
    console.log(`Express server started on port ${port}`);
});

app.get('/', (req, res) => {
    res.send('Express service running');
});

app.post('/notification/register', (req, res) => {
    const { token, pdm } = req.body;

    if (tokens.includes(token)) {
        console.log('Token already registered');
        res.status(200).send('Token already registered');
    } else {
        console.log('Registering token', token);
        tokens.push(token);
        res.status(200).send('Device registered successfully !');
    }
});

app.get('/notification/send-basic', (_, res) => {
    console.log('Sending basic message to', tokens);

    const payload: MulticastMessage = {
        tokens: tokens,
        notification: {
            title: 'ALERT: Crossing Trend Line',
            body: 'TDWL - 1010, Crossing Trend Line',
            imageUrl: 'https://www.directfn.com/favicon-32x32.png'
        },
        android: {
            collapseKey: 'TL',
            priority: 'high',
            ttl: 120,
            notification: {
                tag: 'TL'
            }
        },
        apns: {
            payload: {
                aps: {
                    category: 'TL',
                    'thread-id': 'TL'
                }
            }
        }
    }

    admin
        .messaging()
        .sendEachForMulticast(payload)
        .then((result) => {
            console.log(result);
            res.status(200).send(result);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send(error);
        });
});

app.get('/notification/send-advanced', async (_, res) => {
    console.log('Sending html content message to', tokens);

    const htmlContentPath = path.resolve(__dirname, '../html-notification/index.html');
    const htmlContent = await fs.promises.readFile(htmlContentPath, {encoding: 'utf-8'});

    const payload: MulticastMessage = {
        tokens: tokens,
        notification: {
            title: "Pro11 Message",
            body: "You received a message from Pro11"
        },
        data: {
            htmlContent: htmlContent
        }
    }

    admin
        .messaging()
        .sendEachForMulticast(payload)
        .then((result) => {
            console.log(result);
            res.status(200).send('Message successfully sent !');
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send(error);
        });
});
