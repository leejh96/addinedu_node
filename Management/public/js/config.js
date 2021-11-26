const fConfig = {
    apiKey: "AIzaSyADmbs627bvtqlFg6sWb7YTq-ZeWlC6-0U",
    authDomain: "addinedu-project.firebaseapp.com",
    projectId: "addinedu-project",
    storageBucket: "addinedu-project.appspot.com",
    messagingSenderId: "359897577332",
    appId: "1:359897577332:web:a199bf8279f7ac1d50de21"
};

// Initialize Firebase
if (!firebase.app.length) {
    app = firebase.initializeApp(fConfig);
} else {
    app = firebase.app;
}