<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 pb-5>
        <v-btn @click="loadAsItCan">Load and render as they are loaded</v-btn>
        <v-btn @click="loadEverything">Load everything before rendering</v-btn>
      </v-flex>
      <v-flex xs12>
        <v-progress-circular v-if="loading" indeterminate color="accent"></v-progress-circular>
      </v-flex>
      <v-flex
        xs12
        sm6
        class="pr-2 pb-2 document-container"
        v-for="(item, i) in items"
        :key="i"
        @click="open(item)"
      >
        <div class="document">
          <h2>{{item.title}}</h2>
          <p>
            <a :href="item.url">{{item.url}}</a>
          </p>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>
export default {
  components: {},
  data: () => {
    return {
      items: [],
      loading: false
    };
  },
  methods: {
    loadAsItCan() {
      this.loading = true;
      this.items.splice(0);
      /*
        Read from a list
        Endpoint: _api/Web/Lists/getbytitle('SampleLibrary')/items
      */
      this.$sp
        .getListData({
          listName: "SampleLibrary",
          select: "ID,Title",
          devStaticDataUrl: "TestData/library-items.json"
        })
        .then(data => {
          this.loading = false;
          data.forEach(dataItem => {
            this.loadItem(dataItem).then(resolvedItem => {
              this.items.push(resolvedItem);
            });
          });
        })
        .catch(error => {
          this.$logger.log(error);
        });
    },
    loadEverything() {
      let loaders = [];
      this.loading = true;
      this.items.splice(0);
      /*
        Read from a list
        Endpoint: _api/Web/Lists/getbytitle('SampleLibrary')/items
      */
      this.$sp
        .getListData({
          listName: "SampleLibrary",
          select: "ID,Title",
          devStaticDataUrl: "TestData/library-items.json"
        })
        .then(data => {
          // push promises of loading each deferred item into an array
          data.forEach(dataItem => {
            loaders.push(this.loadItem(dataItem));
          });

          // once all promises have resolved:
          Promise.all(loaders)
            .then(resolvedItems => {
              this.loading = false;
              resolvedItems.forEach(resolvedItem => {
                this.items.push(resolvedItem);
              });
            })
            .catch(error => {
              this.$logger.log(error);
            });
        })
        .catch(error => {
          this.$logger.log(error);
        });
    },
    loadItem(dataItem) {
      return new Promise((resolve, reject) => {
        let item = {
          id: dataItem.ID,
          title: dataItem.Title,
          url: null
        };
        /*
          Read from another list of "deferred data"
          Match up with another list by ID: SampleDeferredList.ItemID==SampleList.ID
          
          OR, as is common with SharePoint REST API, obtain the full URL to the deferred data. 
          Example of deferred data in a SharePoint response:
            "File": {
			        "__deferred": {
				        "uri": "https://.../_api/Web/Lists(guid'eadbcbc5-a3b2-4134-c71a-8fd6535b3ac4')/Items(187)/File"
			        }
		        }
          And use this type of call to get it:
            this.$sp.get({ url: dataItem.__metadata.uri}).then(deferredData => ...)

          Endpoint: <the URL of the deferred item>
        */
        this.$sp
          .get({
            url: dataItem.__metadata.uri,
            devStaticDataUrl: "TestData/deferred-data-example.json"
          })
          .then(deferredData => {
            item.url = deferredData.ServerRedirectedEmbedUrl;
            resolve(item);
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  }
};
</script>

<style scoped>
.document-container {
  display: flex;
}
.document {
  border: 1px solid #444;
  padding: 10px;
  cursor: pointer;
}
.document:hover {
  background-color: #ffe600;
}
.document h2 {
  line-height: 130%;
}
.document img {
  width: 100%;
}
</style>