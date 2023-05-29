const notificationAPI = electron.Notification;
const senderId = '393824837019';
const btnSubscribeElement = document.getElementById('subscribe');
const btnReceiveElement = document.getElementById('receive');

btnSubscribeElement.onclick = async () => {
  try {
    await fetch('http://localhost:9898/notification/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: window.fcm_token,
        pdm: 61,
      }),
    });

    btnSubscribeElement.disabled = true;
    btnReceiveElement.disabled = false;
  } catch (e) {
    console.error('Error while registering for push notifications', e);
  }
};

btnReceiveElement.onclick = () => {
  fetch('http://localhost:9898/notification/sendToSpecific', {
    method: 'GET',
  });
};

notificationAPI.onServiceStarted((token) => {
  window.fcm_token = token;
  console.log('fcm token', token);
  btnSubscribeElement.disabled = false;
  btnReceiveElement.disabled = true;
});

notificationAPI.onServiceError((error) => {
  console.log('service error', error);
  btnSubscribeElement.disabled = true;
});

notificationAPI.onTokenUpdated((token) => {
  window.fcm_token = token;
  console.log('updated fcm token', token);
});

notificationAPI.onNotificationReceived((notification) => {
  console.log('notification', notification);
});

notificationAPI.startService(senderId);
