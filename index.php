<!DOCTYPE html>
<html>
<head>
  <meta charset=utf-8 />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Firebase Cloud Messaging Example</title>
  
</head>
<body>
  <h3>Firebase Cloud Messaging</h3>

  <div id="messages"></div>
  <!-- Insert these scripts at the bottom of the HTML, but before you use any Firebase services -->

  <!-- Firebase App (the core Firebase SDK) is always required and must be listed first -->
  <script src="https://www.gstatic.com/firebasejs/6.2.0/firebase-app.js"></script>

  <!-- Add Firebase products that you want to use -->
  <script src="https://www.gstatic.com/firebasejs/6.2.0/firebase-auth.js"></script>
  <script src="https://www.gstatic.com/firebasejs/6.2.0/firebase-firestore.js"></script>
  <script src="https://www.gstatic.com/firebasejs/6.2.0/firebase-messaging.js"></script>

  <script type="text/javascript" src="firebase-config.js"></script>
  <script type="text/javascript" src="web-notifications.js"></script>
  <script type="text/javascript" src="messaging.js"></script>
</body>
</html>