<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 sm6 pr-5 mb-5>
        <h2>Rich-text editor:</h2>
      </v-flex>
      <v-flex xs12 sm6 mb-5></v-flex>
      <v-flex xs12 sm6 pr-5>
        <vue-editor v-model="abstract" :editor-toolbar="customToolbar"></vue-editor>
      </v-flex>
      <v-flex xs12 sm6></v-flex>
    </v-layout>
  </v-container>
</template>


<script>
import { VueEditor } from "vue2-editor";

export default {
  components: {
    VueEditor
  },
  data: () => {
    return {
      abstract: "<p>Put some <i>rich-text</i> in here...</p>",
      customToolbar: [
        ["bold", "italic"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ color: [] }],
        ["link"],
        ["clean"]
      ]
    };
  }
};
</script>
<style scoped>
h2 {
  padding: 15px;
  background-color: #555;
  color: #ddd;
  line-height: 120%;
  height: 100%;
}
</style>