// Initialize Firebase
const firebaseConfig = {
	apiKey: "AIzaSyAmeAO2aH-FUjzCUuTPgGhkIQCpwzb-JHs",
	authDomain: "ttsviajes-test.firebaseapp.com",
	databaseURL: "https://ttsviajes-test.firebaseio.com",
	projectId: "ttsviajes-test",
	storageBucket: "ttsviajes-test.appspot.com",
	messagingSenderId: "92010404423",
	appId: "1:92010404423:web:9c8e4c1809b71fcd"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// [START get_messaging_object]
// Retrieve Firebase Messaging object.
const messaging = firebase.messaging();
// [END get_messaging_object]
// [START set_public_vapid_key]
// Add the public key generated from the console here.
messaging.usePublicVapidKey('BIvP8U7o9TbHUib2Gd2zE3wREniJg3AcsS4KrzTeBFC5aiSptk7ZNB3x1NLwJtWuh-wh8HknqFhzsrcVe7-TTXg');
// [END set_public_vapid_key]

// [START refresh_token]
// Callback fired if Instance ID token is updated.
messaging.onTokenRefresh(() => {
	messaging.getToken().then((refreshedToken) => {
		console.log('Token refreshed.');
	    // Indicate that the new Instance ID token has not yet been sent to the
	    // app server.
	    setTokenSentToServer(false);
	    // Send Instance ID token to app server.
	    sendTokenToServer(refreshedToken);
	    // [START_EXCLUDE]
	    // Display new Instance ID token and clear UI of all previous messages.
	    requestPermission();
	    // [END_EXCLUDE]
  	}).catch((err) => {
  		console.log('Unable to retrieve refreshed token ', err);
	});
});
// [END refresh_token]

// [START receive_message]
// Handle incoming messages. Called when:
// - a message is received while the app has focus
// - the user clicks on an app notification created by a service worker
//   `messaging.setBackgroundMessageHandler` handler.
messaging.onMessage((payload) => {
	console.log('Message received. ', payload);
	appendMessage(payload);
});

// [END receive_message]
function requestPermission() {
	showToken('loading...');
	// [START get_token]
	// Get Instance ID token. Initially this makes a network call, once retrieved
	// subsequent calls to getToken will return from cache.
	messaging.getToken().then((currentToken) => {
	if (currentToken) {
		sendTokenToServer(currentToken);
	} else {
		// Show permission request.
		console.log('No Instance ID token available. Request permission to generate one.');
		setTokenSentToServer(false);
	}
	}).catch((err) => {
		console.log('An error occurred while retrieving token. ', err);
		showToken('Error retrieving Instance ID token. ', err);
		setTokenSentToServer(false);
	});
	// [END get_token]
}

function showToken(currentToken) {
    console.log('currentToken', currentToken);
}

// Send the Instance ID token your application server, so that it can:
// - send messages back to this app
// - subscribe/unsubscribe the token from topics
function sendTokenToServer(currentToken) {
	if (!isTokenSentToServer()) {
		console.log('Sending token to server...');
		// TODO(developer): Send the current token to your server.
		setTokenSentToServer(true);
	} else {
		console.log("Token already sent to server so won't send it again unless it changes");
		showToken(currentToken);
	}
}

function isTokenSentToServer() {
	return window.localStorage.getItem('sentToServer') === '1';
}

function setTokenSentToServer(sent) {
	window.localStorage.setItem('sentToServer', sent ? '1' : '0');
	console.log('localStorage' , sent);
}

function requestPermissionInit() {
	console.log('Requesting permission...');
	// [START request_permission]
	Notification.requestPermission().then((permission) => {
		if (permission === 'granted') {
			console.log('Notification permission granted.');
			// TODO(developer): Retrieve an Instance ID token for use with FCM.
			// [START_EXCLUDE]
			// In many cases once an app has been granted notification permission,
			// it should update its UI reflecting this.
			requestPermission();
			// [END_EXCLUDE]
		} else {
			console.log('Unable to get permission to notify.');
		}
	});
	// [END request_permission]
}
// Add a message to the messages element.
function appendMessage(payload) {
	const messagesElement = document.querySelector('#messages');
	const dataHeaderELement = document.createElement('h5');
	const dataElement = document.createElement('pre');
	dataElement.style = 'overflow-x:hidden;';
	dataHeaderELement.textContent = 'Received message:';
	dataElement.textContent = JSON.stringify(payload.notification, null, 2);
	messagesElement.appendChild(dataHeaderELement);
	messagesElement.appendChild(dataElement);
}

// function deleteToken() {
// 	// Delete Instance ID token.
// 	// [START delete_token]
// 	messaging.getToken().then((currentToken) => {
// 		messaging.deleteToken(currentToken).then(() => {
// 			console.log('Token deleted.');
// 			setTokenSentToServer(false);
// 			// [START_EXCLUDE]
// 			// Once token is deleted update UI.
// 			requestPermission();
// 			// [END_EXCLUDE]
// 		}).catch((err) => {
// 			console.log('Unable to delete token. ', err);
// 		});
// 		// [END delete_token]
// 	}).catch((err) => {
// 		console.log('Error retrieving Instance ID token. ', err);
// 	});
// }

requestPermissionInit();

// const firebaseConfig = {
//   apiKey: "AIzaSyAmeAO2aH-FUjzCUuTPgGhkIQCpwzb-JHs",
//   authDomain: "ttsviajes-test.firebaseapp.com",
//   databaseURL: "https://ttsviajes-test.firebaseio.com",
//   projectId: "ttsviajes-test",
//   storageBucket: "ttsviajes-test.appspot.com",
//   messagingSenderId: "92010404423",
//   appId: "1:92010404423:web:9c8e4c1809b71fcd"
// };
//  // Initialize the Firebase app in the service worker by passing in the
//  // messagingSenderId.
//  firebase.initializeApp(firebaseConfig);
//  // Retrieve an instance of Firebase Messaging so that it can handle background
//  // messages.
//  const messaging = firebase.messaging();
//  messaging.requestPermission()
//  .then(() => {
//  	console.log('Have permission.');
//  })
//  .catch((err) => {
//  	console.log('Error.', err);

//  })
//  // [END initialize_firebase_in_sw]
// // const messaging = firebase.messaging();
// // messaging.usePublicVapidKey('BIhmQEJT8Xlv05OWN7kML5GFIKaTkg61UJ20d-p7u2VLA2x0ENWuZxH-n3U0rEcH2i84Q9bgi-YrAGHQkRm7XBI');

// // (function() {

// // 	messaging.onTokenRefresh(function() {
// // 		messaging.getToken().then(function(refreshedToken) {
// // 	  		console.log('Token refreshed.');
// // 	  		console.log('current token in app ' + refreshedToken);
// // 	  		storeToken(refreshedToken);
// // 		}).catch(function(err) {
// // 	  		console.log('Unable to retrieve refreshed token ', err);
// // 		});
// // 	});

// // 	function initializeMessaging() {
// // 		// Get Instance ID token. Initially this makes a network call, once retrieved
// // 		// subsequent calls to getToken will return from cache.
// // 		messaging.getToken().then(function(currentToken) {
// // 	  		if (currentToken) {
// // 	  			console.log('current token in app ' + currentToken);
// // 				storeToken(currentToken);
// // 	  		} else {
// // 				console.log('No Instance ID token available. Request permission to generate one.');
// // 	  		}
// // 		}).catch(function(err) {
// // 	  		console.log('An error occurred while retrieving token. ', err);
// // 		});
// // 	}

// // 	 // Send the Instance ID token your application server, so that it can:
// // 	// - send messages back to this app
// // 	// - subscribe/unsubscribe the token from topics
// // 	function storeToken(currentToken) {
// // 		if (!isTokenNotifications()) {
// // 			console.log('Setting token...');
// // 			// TODO(developer): Send the current token to your server.
// // 			setTokenNotifications(currentToken);
// // 		} else {
// // 			console.log('Token already setted ' + 'unless it changes');
// // 		}
// // 	}

// // 	function setTokenNotifications(token) {
// // 		window.localStorage.setItem('tokenNotifications', token);
// // 		console.log('token.', token);

// // 	}

// // 	function requestPermission() {
// // 		console.log('Requesting permission...');
// // 		Notification.requestPermission().then(function(permission) {
// // 	 		if (permission === 'granted') {
// // 				console.log('Notification permission granted.');
// // 				initializeMessaging();
// // 	 		 } else {
// // 				console.log('Unable to get permission to notify.');
// // 	  		}
// // 		});
// // 	}

// // 	requestPermission();
// // })();
// // function isTokenNotifications() {
// // 	return window.localStorage.getItem('tokenNotifications') !== null;
// // }

// // // Handle incoming messages:
// // messaging.onMessage(function(payload) {
// // 	console.log('notification received', payload);
// // 	// Customize notification here
// // 	let notificationTitle = payload.data.title;
// // 	let notificationOptions = {
// // 		body: payload.data.body,
// // 		icon: payload.data.icon   
// // 	};

// //     let notification = new Notification(notificationTitle,notificationOptions);
// //     notification.onclick = function(event){ window.open(payload.data.click_action, '_blank');}
// // });