<template>
  <nav>
    <span v-for="(item,index) in navMenuOptions" :key="index" v-show="item.active">
      <v-btn :to="item.path" :color="item.color" :flat="flat" :dark="dark">{{item.label}}</v-btn>
    </span>
    <v-menu offset-y class="mobile">
      <template v-slot:activator="{ on }">
        <v-btn class="mobile" :color="color" :dark="dark" :flat="flat" v-on="on">Navigation</v-btn>
      </template>
      <v-list>
        <v-list-tile
          v-for="(item, index) in navMenuOptions"
          :key="index"
          v-show="item.active"
          :to="item.path"
        >
          <v-list-tile-title :color="item.color">{{ item.label }}</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
  </nav>
</template>
<script>
/*
 * NavMenu
 * @date 2019-05-06b
 */
export default {
  props: {
    items: Array,
    useRouteOptions: { type: Boolean, default: false },
    color: { type: String, default: "blue-grey darken-3 white--text" },
    activeColor: { type: String, default: "deep-orange darken-2 white--text" },
    flat: { type: Boolean, default: false },
    dark: { type: Boolean, default: false }
  },
  data: () => {
    return {
      navMenuOptions: []
    };
  },
  created() {
    if (this.useRouteOptions) this.determineNavsFromRouter();
    else this.setNavFomItems();
  },
  mounted() {
    this.updateNavsFromRoute();
  },
  watch: {
    $route() {
      this.updateNavsFromRoute();
    },
    items() {
      this.updateNavsFromRoute();
    }
  },
  methods: {
    setNavFomItems() {
      if (this.items && this.items.length) {
        this.navMenuOptions.splice(0);
        this.items.forEach(item => {
          this.navMenuOptions.push(item);
        });
      }
    },
    determineNavsFromRouter() {
      if (
        this.$router &&
        this.$router.options &&
        this.$router.options.routes &&
        this.$router.options.routes.length
      ) {
        this.navMenuOptions.splice(0);
        this.$router.options.routes.forEach(route => {
          this.navMenuOptions.push({
            name: route.name,
            path: route.path,
            label: route.label,
            icon: route.icon,
            active: route.active,
            color: ""
          });
        });
        this.updateNavsFromRoute();
      }
    },
    /*
      Restrict access based on provided restrictions:
      {
        <routeName>: <is active boolean>
      }
    */
    restrictAccess(restrictions) {
      for (let r in restrictions) {
        let setting = restrictions[r];
        this.navMenuOptions.forEach(option => {
          if (option.name == r) option.active = setting;
        });
      }
    },
    updateNavsFromRoute() {
      this.navMenuOptions.forEach(item => {
        item.color =
          item.name == this.$route.name ? this.activeColor : this.color;
      });
    }
  }
};
</script>
<style scoped>
nav {
  display: flex;
  flex-flow: row wrap;
  align-content: center;
  justify-content: space-around;
  padding-bottom: 5px;
}
nav span {
  margin-right: 10px;
}
nav .mobile {
  display: none;
}
@media screen and (max-width: 767px) {
  nav span {
    display: none;
  }
  nav .mobile {
    display: block;
  }
}
</style>