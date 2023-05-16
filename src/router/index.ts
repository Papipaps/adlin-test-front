import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import { inject, ref, type Ref } from "vue";
import { getLoggedUser, type User } from "@/service/auth/auth.service";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      meta: { requiresAuth: false },
      component: Login,
    },
    {
      path: "/rooms",
      name: "rooms",
      meta: { requiresAuth: true },
      component: () =>
        import(/*webpackChunkName:"rooms"*/ "@/views/HomeComponent.vue"),
    },
    {
      path: "/bookings",
      name: "bookings",
      meta: { requiresAuth: true },
      component: () =>
        import(/*webpackChunkName:"bookings"*/ "@/views/BookingList.vue"),
    },
  ],
});
router.beforeEach((to, from, next) => { 
  const user = getLoggedUser(); 
  const isAuthenticated = user.value != null; 

  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/");
    return { name: "login", params: {}, query: to?.query, hash: to.hash };
  } else if (to.name === "login" && isAuthenticated) {
    next("/rooms");
    return { name: "rooms", params: {}, query: to?.query, hash: to.hash };
  } else {
    next();
    return;
  }
});
export default router;
