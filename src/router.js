import Vue from "vue";
import Router from "vue-router";
import SiteExample from "./views/SiteExample.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "site-example",
      label: "Site example",
      active: true,
      component: SiteExample
    },
    {
      path: "/list-read-example",
      name: "ListReadExample",
      label: "List read",
      active: true,
      component: () =>
        import(
          /* webpackChunkName: "ListReadExample" */ "./views/ListReadExample"
        )
    },
    {
      path: "/cms-editor-example",
      name: "CMSEditorExample",
      label: "CMS Editor",
      active: true,
      component: () =>
        import(
          /* webpackChunkName: "CMSEditorExample" */ "./views/CMSEditorExample"
        )
    },
    {
      path: "/library-read-example",
      name: "LibraryReadExample",
      label: "Library read",
      active: true,
      component: () =>
        import(
          /* webpackChunkName: "LibraryReadExample" */ "./views/LibraryReadExample"
        )
    },
    {
      path: "/deferred-read-example",
      name: "DeferredReadExample",
      label: "Deferred read",
      active: true,
      component: () =>
        import(
          /* webpackChunkName: "DeferredReadExample" */ "./views/DeferredReadExample"
        )
    },
    {
      path: "/update-example",
      name: "UpdateExample",
      label: "Update",
      active: true,
      component: () =>
        import(/* webpackChunkName: "UpdateExample" */ "./views/UpdateExample")
    },
    {
      path: "/user-example",
      name: "UserExample",
      label: "User",
      active: true,
      component: () =>
        import(/* webpackChunkName: "UserExample" */ "./views/UserExample")
    },
    { path: "*", redirect: "/" }
  ]
});
