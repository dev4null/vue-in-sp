<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 sm6 pr-5 mb-5>
        <h2>Rich-text editor:</h2>
      </v-flex>
      <v-flex xs12 sm6 mb-5>
        <h2>How the content is read/written to the multi-line text field in the SharePoint list:</h2>
      </v-flex>
      <v-flex xs12 sm6 pr-5>
        <v-progress-circular v-if="!readyToUpdate || !updateUrl" indeterminate color="accent"></v-progress-circular>
        <vue-editor
          v-if="readyToUpdate && updateUrl"
          v-model="abstract"
          :editor-toolbar="customToolbar"
          @blur="save"
        ></vue-editor>
      </v-flex>
      <v-flex xs12 sm6>{{abstract}}</v-flex>
      <v-flex xs12>
        <v-alert :value="isSaving" color="green" transition="v-fade-transition">Saving...</v-alert>
      </v-flex>
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
      readyToUpdate: false,
      abstract: "",
      updateUrl: null,
      isSaving: false,
      customToolbar: [
        ["bold", "italic"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ color: [] }],
        ["link"],
        ["clean"]
      ]
    };
  },
  created() {
    /*
      IMPORTANT: get SharePoint Form Digest value - required for writing/updating content
    */
    this.$sp
      .getFormDigest()
      .then(() => {
        this.readyToUpdate = true;
        this.load();
      })
      .catch(error => {
        this.log("No digest available");
      });
  },
  methods: {
    load() {
      /*
        Read one item from a list
        Endpoint: _api/Web/Lists/getbytitle('SampleList')
      */
      this.$sp
        .getListData({
          listName: "SampleList",
          select: "ID,Title,Content",
          filter: "Title eq 'An item to update'",
          top: 1,
          devStaticDataUrl: "TestData/list-update-example.json"
        })
        .then(results => {
          if (results && results.length) this.abstract = results[0].Content;
          this.updateUrl = results[0].__metadata.uri;
        });
    },
    save() {
      if (this.updateUrl) {
        this.isSaving = true;
        /*
          Update one item in a list.

          IMPORTANT: the $sp.updateListItem() method does the following:
            1. re-read the __metadata.etag value from the list item.
            2. post the updated date to that list.

          Endpoint: The direct update URL of that item, obtained from __metadata.uri
        */
        this.$sp
          .updateListItem({
            listName: "SampleList",
            itemData: {
              Content: this.abstract
            },
            itemUrl: this.updateUrl
          })
          .then(() => {
            // could show a "Saved." message
          })
          .catch(error => {
            console.log(error);
            this.$logger.log(error);
          });
        setTimeout(() => {
          this.isSaving = false;
        }, 1000);
      } else this.$logger.log("No update URL");
    }
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