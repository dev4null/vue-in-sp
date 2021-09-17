<template>
  <v-app>
    <!--
    <nav-menu use-route-options />
    -->
    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
/**
 * Vue in SharePoint
 * @date 2019-05-06
 * @requires store/modules/users
 **/
// import NavMenu from '@/components/NavMenu'
// import transitions from '@/css/transitions.css'

export default {
  name: 'App',
  // components: { NavMenu },
  computed: {
    currentUser() {
      return this.$store.getters['users/currentUser']
    }
  }
}
</script>
<style scoped>
</style>
