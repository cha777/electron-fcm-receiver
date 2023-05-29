const { contextBridge, ipcRenderer } = require('electron');

const NotificationEvents = {
  // Event to be sent from renderer process to trigger service start
  START_NOTIFICATION_SERVICE: 'PUSH_RECEIVER:::START_NOTIFICATION_SERVICE',
  // Event sent to the renderer process once the service is up
  NOTIFICATION_SERVICE_STARTED: 'PUSH_RECEIVER:::NOTIFICATION_SERVICE_STARTED',
  // Event sent to the renderer process if an error has occured during the starting process
  NOTIFICATION_SERVICE_ERROR: 'PUSH_RECEIVER:::NOTIFICATION_SERVICE_ERROR',
  // Event sent to the renderer processs when a notification has been received
  NOTIFICATION_RECEIVED: 'PUSH_RECEIVER:::NOTIFICATION_RECEIVED',
  // Event sent to the renderer processs when the FCM token has been updated
  TOKEN_UPDATED: 'PUSH_RECEIVER:::TOKEN_UPDATED',
};

contextBridge.exposeInMainWorld('electron', {
  Versions: {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
  },
  Notification: {
    startService: (senderId) => ipcRenderer.send(NotificationEvents.START_NOTIFICATION_SERVICE, senderId),
    onServiceStarted: (callback) =>
      ipcRenderer.on(NotificationEvents.NOTIFICATION_SERVICE_STARTED, (_, token) => {
        callback(token);
      }),
    onServiceError: (callback) => {
      ipcRenderer.on(NotificationEvents.NOTIFICATION_SERVICE_ERROR, (_, error) => {
        callback(error);
      });
    },
    onTokenUpdated: (callback) => {
      ipcRenderer.on(NotificationEvents.TOKEN_UPDATED, (_, token) => {
        callback(token);
      });
    },
    onNotificationReceived: (callback) => {
      ipcRenderer.on(NotificationEvents.NOTIFICATION_RECEIVED, (_, notification) => {
        callback(notification);
      });
    },
  },
});
