/* Vuetify a-la-carte loading and configuration 2018-10-21 */
import Vue from "vue";
import Vuetify, {
  VApp,
  VFooter,
  VToolbar,
  VTabs,
  transitions
} from "vuetify/lib";
import { Ripple } from "vuetify/lib/directives";
import 'vuetify/src/stylus/app.styl'

Vue.use(Vuetify, {
  components: {
    VApp,
    VFooter,
    VToolbar,
    VTabs,
    transitions
  },
  directives: {
    Ripple
  },
  theme: {
    primary: "#00a3ae",
    secondary: "#7fd1d6",
    accent: "#ffe600",
    info: "#fff27f",
    success: "#95cb89",
    error: "#f04c3e",
    warning: "#ac98db"
  },
  customProperties: true,
  iconfont: "mdi"
});
