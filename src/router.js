import Vue from "vue";
import Router from "vue-router";
import TopPage from "@/components/TopPage";
import Signup from "@/components/Signup";
import Signin from "@/components/Signin";
import firebase from "firebase";

Vue.use(Router);

let router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "*",
      redirect: "signIn"
    },
    {
      path: "/",
      name: "TopPage",
      component: TopPage,
      meta: { requiresAuth: true }
    },
    {
      path: "/signup",
      name: "Signup",
      component: Signup
    },
    {
      path: "/signin",
      name: "Signin",
      component: Signin
    }
  ]
});

router.beforeEach((to, from, next) => {
  let currentUser = firebase.auth().currentUser;
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  if (requiresAuth && !currentUser) next("signin");
  else if (!requiresAuth && currentUser) next();
  else next();
});

export default router;
