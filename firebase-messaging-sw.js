// // If you would like to customize notifications that are received in the
// // background (Web app is closed or not in browser focus) then you should
// // implement this optional method.
// // [START background_handler]
messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  let notificationTitle = payload.notification.title;
  let notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon   
  };

  return self.registration.showNotification(notificationTitle,
    notificationOptions);
});
// // [END background_handler]