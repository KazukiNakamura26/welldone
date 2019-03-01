import Vue from "vue";
import Router from "vue-router";
import firebase from "firebase";
import HelloWorld from "@/components/HelloWorld";
import Signup from "@/components/Signup";
import Signin from "@/components/Signin";

Vue.use(Router);

let router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: '*',
      redirect: 'signin'
    },
    {
      path: "/",
      name: "HelloWorld",
      component: HelloWorld,
      meta: { requiresAuth: true}
    },
    {
      path: "/signin",
      name: "signin",
      component: Signin
    },
    {
      path: "/signup",
      name: "singnup",
      component: Signup
    }
  ]
});

Router.beforeEach((to, from, next) => {
  let currentUser = firebase.auth().currentUser;
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  if (requiresAuth && !currentUser) next("signin");
  else if (!requiresAuth && currentUser) next();
  else next();
})

export default router;
