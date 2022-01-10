/**
 * Vue in SharePoint
 * @date 2019-05-09
 **/
import '@babel/polyfill'
import Vue from 'vue'
import router from './router'
import SharePoint from './plugins/sharepoint-vue-plugin'
import store from './store'
import App from './App.vue'

import '@/css/base.css'
import '@/css/layout.css'
import '@/css/theme.css'

import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'

import ru from 'vuetify/es5/locale/ru'

Vue.use(Vuetify, {
  lang: {
    locales: { ru },
    current: 'ru'
  }
})

const opts = {
  icons: {
    iconfont: 'mdi' // default - only for display purposes
  }
}

const DEV_MODE = process.env.NODE_ENV !== 'production'
const PRODUCTION_DOMAIN = 'https://corp.polyus.com/medicalrecord/'
const BASE_PATH = ''

Vue.use(SharePoint, BASE_PATH, {
  productionHosts: [PRODUCTION_DOMAIN],
  currentUserPropertiesPathPrefix:
    '/_api/sp.userprofiles.peoplemanager/getmyproperties/?$select=',
  showConsoleActivityInDev: false,
  devLoadDelayMin: 500,
  devLoadDelayMax: 3000,
  devLoadDelay: 1200
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify: new Vuetify(opts),
  data: {
    devMode: DEV_MODE,
    fiscalYear: null,
    routeIndex: 0
  },
  created() {
    // set SharePoint for error logger

    this.$vuetify.lang.current = 'ru'

    // register a global reference to access the logger
    if (typeof window === 'object') window.logger = this.$logger

    // get SharePoint Form Digest value - required for writing/updating content
    /*  this.$sp.getFormDigest().catch(error => {
      this.log('No digest available')
/    })
*/

    // identify current user
    this.$store
      .dispatch('users/loadCurrentUser', {
      })
      .catch(error => {
        this.$logger.log(error)
      })
  },
  render: h => h(App)
}).$mount('#app')
