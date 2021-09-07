import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";

const routes = [{
        path: "/",
        name: "Home",
        component: Home,
    },
    {
        path: "/about",
        name: "About",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
            import ( /* webpackChunkName: "about" */ "../views/About.vue"),
    },
    {
        path: "/profile",
        name: "Profile",
        // route level code-splitting
        // this generates a separate chunk (profile.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
            import ( /* webpackChunkName: "profile" */ "../views/Profile.vue"),
    },
    {
        path: "/publication",
        name: "Publication",
        // route level code-splitting
        // this generates a separate chunk (publication.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
            import ( /* webpackChunkName: "publication" */ "../views/Publication.vue"),
    },
    {
        path: "/:pathMatch(.*)*",
        name: "404",
        // component: NotFound,
        // meta: {
        //     title: "404",
        // },
        component: () =>
            import (
                /* webpackChunkName: "registration" */
                "../views/NotFound.vue"
            ),
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;