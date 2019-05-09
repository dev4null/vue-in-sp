<template>
  <v-container>
    <v-layout row wrap>
      <v-flex
        xs12
        sm6
        lg4
        class="pr-2 pb-2 document-container"
        v-for="(item, i) in items"
        :key="i"
        @click="open(item)"
      >
        <div class="document">
          <h2>{{item.title}}</h2>
          <img :src="item.imageUrl">
          <div>{{item.summary}}</div>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>
export default {
  data: () => {
    return {
      items: []
    };
  },
  created() {
    /*
      Read from a library
      including additional custom fields such as 'Summary' and 'Published'

      Endpoint: _api/Web/Lists/getbytitle('SampleLibrary')/items
    */
    this.$sp
      .getListData({
        listName: "SampleLibrary",
        select: "ID,Title,FileRef,Summary",
        filter: "Published eq 1",
        orderby: "Title asc",
        devStaticDataUrl: "TestData/library-items.json"
      })
      .then(files => {
        if (files && files.length)
          files.forEach(file => {
            this.items.push({
              id: file.ID,
              title: file.Title,
              path: file.FileRef,
              summary: file.Summary,
              imageUrl: `https://picsum.photos/id/${file.ID * 12}/300/250`
            });
          });
      })
      .catch(error => {
        this.$logger.log(error);
      });
  },
  methods: {
    open(item) {
      if (item && item.path) window.open(item.path, "document");
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