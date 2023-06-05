importScripts("https://www.gstatic.com/firebasejs/9.19.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.19.1/firebase-messaging-compat.js");
const firebaseConfig = {
    apiKey: "AIzaSyCV7Wcy6pnemMmARRUc-X9qix0nZRmmdD8",
    authDomain: "test-deb6a.firebaseapp.com",
    projectId: "test-deb6a",
    storageBucket: "test-deb6a.appspot.com",
    messagingSenderId: "702085190161",
    appId: "1:702085190161:web:18b918699d62d0fdd197b0",
    measurementId: "G-10G47C4NT1"
  };


const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging(app);

messaging.onBackgroundMessage(payload => {
    console.log("Recibiste mensaje mientras estabas ausente hola");
    // previo a mostrar notificación
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: "/logo192.png"
    }


    return self.registration.showNotification(
        notificationTitle,
        notificationOptions
    )
})