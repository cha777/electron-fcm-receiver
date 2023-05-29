# FCM Electron POC

This POC project is to demonstrate possibility of receiving push notifications with FCM. Application uses nodejs express server with firebase admin tool to register and send notifications to the registered devices

# Getting Start

1. Install required packages

```
npm install
```

2. Paste firebase config file inside server folder. change file name to firebase-config.json
3. start both electron app and express server

```
npm start
```

4. Click subscribe in electron app to register created fcm token in server
5. Click receive to receive sample push notification. You can view notification data in the chrome dev tool
