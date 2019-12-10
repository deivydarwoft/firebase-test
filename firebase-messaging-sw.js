 // [START initialize_firebase_in_sw]
 // Give the service worker access to Firebase Messaging.
 // Note that you can only use Firebase Messaging here, other Firebase libraries
 // are not available in the service worker.
 importScripts('https://www.gstatic.com/firebasejs/5.9.1/firebase-app.js');
 importScripts('https://www.gstatic.com/firebasejs/5.9.1/firebase-messaging.js');
 
const firebaseConfig = {
  apiKey: "AIzaSyAmeAO2aH-FUjzCUuTPgGhkIQCpwzb-JHs",
  authDomain: "ttsviajes-test.firebaseapp.com",
  databaseURL: "https://ttsviajes-test.firebaseio.com",
  projectId: "ttsviajes-test",
  storageBucket: "ttsviajes-test.appspot.com",
  messagingSenderId: "92010404423",
  appId: "1:92010404423:web:9c8e4c1809b71fcd"
};
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// [START background_handler]
messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  let notificationTitle = payload.data.title;
  let notificationOptions = {
    body: payload.data.body,
    icon: payload.data.icon   
  };

  return self.registration.showNotification(notificationTitle,
    notificationOptions);
});
// [END background_handler]