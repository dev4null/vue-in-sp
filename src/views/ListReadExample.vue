<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 sm6 pr-5>
        <h2>Read from a list:</h2>
        <v-progress-circular v-if="!contentFromList.length" indeterminate color="accent"></v-progress-circular>
        <p>{{contentFromList}}</p>
      </v-flex>
      <v-flex xs12 sm6>
        <h2>Displayed as HTML:</h2>
        <v-progress-circular v-if="!contentFromList.length" indeterminate color="accent"></v-progress-circular>
        <div v-html="contentFromList"></div>
      </v-flex>
      <v-flex xs12 sm6 pr-5>
        <h2>Stored in Markdown format:</h2>
        <v-progress-circular v-if="!contentFromListMD.length" indeterminate color="accent"></v-progress-circular>
        <p>{{contentFromListMD}}</p>
      </v-flex>
      <v-flex xs12 sm6>
        <h2>Generated from MarkDown:</h2>
        <v-progress-circular v-if="!contentFromListMD.length" indeterminate color="accent"></v-progress-circular>
        <vue-markdown :source="contentFromListMD"></vue-markdown>
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>
import VueMarkdown from "vue-markdown";

export default {
  components: {
    VueMarkdown
  },
  data: () => {
    return {
      contentFromList: "",
      contentFromListMD: ""
    };
  },
  created() {
    /*
      Read from a list
      Endpoint: _api/Web/Lists/getbytitle('SampleList')/items
    */
    this.$sp
      .getListData({
        listName: "SampleList",
        select: "ID,Title,Content",
        filter: "Title eq 'List read example'",
        top: 1,
        devStaticDataUrl: "TestData/list-read-example.json"
      })
      .then(results => {
        if (results && results.length)
          this.contentFromList = results[0].Content;
      });
    /*
      Read  from a list: Content contains Markdown formatted-text
      Endpoint: _api/Web/Lists/getbytitle('SampleList')/items
    */
    this.$sp
      .getListData({
        listName: "SampleList",
        select: "ID,Title,Content",
        filter: "Title eq 'List read md example'",
        top: 1,
        devStaticDataUrl: "TestData/list-read-md-example.json"
      })
      .then(results => {
        if (results && results.length)
          this.contentFromListMD = results[0].Content;
      });
  }
};
</script>
<style scoped>
h2 {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #555;
  color: #ddd;
}
</style>