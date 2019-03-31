import Vue from "vue";
import './plugins/vuetify'
import App from "./App.vue";
import router from "./router";
import store from "./store";
import firebase from "firebase";

let app;

Vue.config.productionTip = false;

const config = {
  apiKey: "AIzaSyDOWyQAnUmNLPxKlWrrB8N3qj04kGVAfog",
  authDomain: "welldone-21fc5.firebaseapp.com",
  databaseURL: "https://welldone-21fc5.firebaseio.com",
  projectId: "welldone-21fc5",
  storageBucket: "welldone-21fc5.appspot.com",
  messagingSenderId: "1004401477630"
};

const settings = { timestampsInSnapshots: true };
firebase.initializeApp(config);

firebase.auth().onAuthStateChanged( user => {
  if (!app) {
    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount("#app");
  }
});
