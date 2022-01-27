import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";
import Computer from "../views/Computer.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/computer",
    name: "Computer",
    component: Computer,
    props: true,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
