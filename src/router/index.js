import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from '../components/HomePage.vue'
import PlaceDetails from '../views/PlaceDetails.vue';
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/view',
    name: 'homeview',
    component: HomeView
  },
  {
    path: '/place/:id',
    name: 'PlaceDetails',
    component: PlaceDetails,
    props: true
  },
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router