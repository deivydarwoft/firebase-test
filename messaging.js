// [START get_messaging_object]
// Retrieve Firebase Messaging object.
const messaging = firebase.messaging();
// [END get_messaging_object]
// [START set_public_vapid_key]
// Add the public key generated from the console here.
messaging.usePublicVapidKey(usePublicVapidKey);
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
function displayNotification(payload) {
    if (Notification.permission == 'granted') {
        // If it's okay let's create a notification
        var theTitle = payload.notification.title;
        var options = {
		    body: payload.notification.body,
		    image: payload.notification.icon
		 }
    	var notification = new Notification(theTitle, options);
    }
}

// [START receive_message]
// Handle incoming messages. Called when:
// - a message is received while the app has focus
// - the user clicks on an app notification created by a service worker
//   `messaging.setBackgroundMessageHandler` handler.
messaging.onMessage((payload) => {
	console.log('Message received. ', payload);
	displayNotification(payload);
	// appendMessage(payload);
	// var notif = showWebNotification(payload.notification.title, payload.notification.body, payload.notification.icon, null, 5000);
});

// [END receive_message]
function requestPermission() {
	showToken('loading...');
	// [START get_token]
	// Get Instance ID token. Initially this makes a network call, once retrieved
	// subsequent calls to getToken will return from cache.
	messaging.getToken().then((currentToken) => {
	if (currentToken) {
		storeToken(currentToken);
		sendTokenToServer(currentToken);
		subscribeTokenToTopic(currentToken, 'general');
	} else {
		// Show permission request.
		console.log('No Instance ID token available. Request permission to generate one.');
		setTokenSentToServer(false);
		requestPermissionInit();
	}
	}).catch((err) => {
		console.log('An error occurred while retrieving token. ', err);
		showToken('Error retrieving Instance ID token. ', err);
		setTokenSentToServer(false);
		requestPermissionInit();
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
		showToken(currentToken);
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
function subscribeTokenToTopic(token, topic) {
  	var myHeaders = new Headers();
  	
	myHeaders.append("Authorization", "key="+firebaseKey);
	myHeaders.append("Content-Type", "application/json");

	var requestOptions = {
	  method: 'POST',
	  headers: myHeaders,
	  redirect: 'follow'
	};

	var urlRequest = 'https://iid.googleapis.com/iid/v1/'+token+'/rel/topics/'+topic;
	fetch(urlRequest, requestOptions)
	  .then(response => response.text())
	  .then(result => console.log('subscribeTokenToTopic',result))
	  .catch(error => console.log('error', error));
}
// Send the Instance ID token your application server, so that it can:
// - send messages back to this app
// - subscribe/unsubscribe the token from topics
function storeToken(currentToken) {
	if (!isTokenNotifications()) {
		console.log('Setting token...');
		// TODO(developer): Send the current token to your server.
		setTokenNotifications(currentToken);
	} else {
		console.log('Token already setted ' + currentToken + 'unless it changes');
	}
}
function setTokenNotifications(token) {
	window.localStorage.setItem('tokenNotifications', token);
}
function isTokenNotifications() {
	return window.localStorage.getItem('tokenNotifications') !== null;
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