<template>
  <div class="grid-layout">
    <nav-menu use-route-options></nav-menu>
    <main>
      <router-view></router-view>
    </main>

    <footer>
      <span class="footer-label">Vue in SharePoint demonstration</span>
      <v-chip>
        <v-avatar>
          <img :src="currentUser.photoUrl">
        </v-avatar>
        {{currentUser.name}}
      </v-chip>
    </footer>
  </div>
</template>

<script>
/**
 * Vue in SharePoint
 * @date 2019-05-06
 * @requires store/modules/users
 **/
import NavMenu from "@/components/NavMenu";
import transitions from "@/css/transitions.css";

export default {
  name: "App",
  components: { NavMenu },
  computed: {
    currentUser() {
      return this.$store.getters["users/currentUser"];
    }
  }
};
</script>
<style scoped>
</style>
