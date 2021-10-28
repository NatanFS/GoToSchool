var firebaseConfig = {
apiKey: "AIzaSyCN-I4MtBOmEZh-UA0-wUaEaGb9aSfEqcA",
authDomain: "projetointegrador-7141d.firebaseapp.com",
databaseURL: "https://projetointegrador-7141d.firebaseio.com",
projectId: "projetointegrador-7141d",
storageBucket: "projetointegrador-7141d.appspot.com",
messagingSenderId: "173544521842",
appId: "1:173544521842:web:1f85ddf0d5dd23334182eb"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    
 }else {
    firebase.app(); // if already initialized, use that one
 }

 firebase.auth().signInAnonymously().then(() => {
   console.log("logado anonimamente")
})