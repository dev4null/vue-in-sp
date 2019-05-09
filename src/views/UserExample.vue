<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 class="pr-4">
        <contact-card :user="user"></contact-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>
import ContactCard from "@/components/ContactCard";

export default {
  components: {
    ContactCard
  },
  data: () => {
    return {
      user: {
        id: null,
        name: null,
        jobTitle: null,
        photoUrl: null,
        email: null,
        accountName: null
      }
    };
  },
  created() {
    /*
      Retrieve information about the current user
      Endpoint: /_api/sp.userprofiles.peoplemanager/getmyproperties
    */
    this.$sp
      .retrieveCurrentUserProfile()
      .then(profileData => {
        this.user.accountName = profileData.AccountName;
        this.user.name = profileData.DisplayName;
        this.user.email = profileData.Email;
        this.user.photoUrl = profileData.PicturUrl;
        this.user.jobTitle = profileData.Title;
      })
      .catch(error => {
        this.$logger.log(error);
      });
  }
};
</script>
