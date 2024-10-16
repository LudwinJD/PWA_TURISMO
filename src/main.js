import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { firebase, db, firebaseConfig, auth } from './firebase';
import HomePage from './components/HomePage.vue';
import PlaceDetails from './views/PlaceDetails.vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import StarRating from './components/StarRating.vue';
import jquery from 'jquery';
window.$ = window.jQuery = jquery;

auth.onAuthStateChanged(() => {
  const app = createApp(App);
  app.use(router);
  app.component('HomePage', HomePage);
  app.component('PlaceDetails', PlaceDetails);
  app.component(StarRating.name, StarRating);
  app.mount('#app');
});

