<template>
  <v-card class="contact" flat>
    <v-layout row wrap v-if="user">
      <v-flex xs12 sm4 md4 lg3 v-if="user.photoUrl">
        <v-avatar size="64px">
          <img :src="user.photoUrl">
        </v-avatar>
      </v-flex>
      <v-flex xs12 sm6 md8 lg9>
        <div class="name">{{ user.name }}</div>
        <div class="role">{{user.jobTitle}}</div>
        <div>{{user.email}}</div>
        <div>{{user.accountName}}</div>
      </v-flex>
    </v-layout>
    <v-card-title v-else>Contact not found.</v-card-title>
  </v-card>
</template>
<script>
export default {
  props: {
    user: { type: Object }
  },
  watch: {
    "user.accountName"() {
      this.$sp
        .retrievePeopleProfile({
          accountName: this.user.accountName,
          property: "PictureUrl"
        })
        .then(profileData => {
          if (profileData.PictureUrl)
            this.user.photoUrl = profileData.PictureUrl;
        });
    }
  },
  methods: {
    contact() {}
  }
};
</script>

<style scoped>
.contact {
  width: 100%;
  height: 100%;
  padding: 10px;
}
.name {
  font-size: 1.2em;
}
.role,
.rank {
  font-size: 1em;
  color: #888;
}
</style>