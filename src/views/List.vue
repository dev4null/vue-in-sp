<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Поиск"
          single-line
          hide-details
        />
        &nbsp;
        <v-btn
          style="margin-top: 15px; margin-left: 15px;"
          outlined
          class="mr-4"
          color="grey darken-2"
          to="/"
        >
          Календарь
        </v-btn>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="events"
        :search="search"
        :loading="isLoading"
        disable-pagination
        fixed-header
        item-key="Id"
        hide-default-footer
        locale="ru-RU"
      />
    </v-card>
  </v-container>
</template>

<script>

export default {
  data: () => {
    return {
      headers: [
        { text: 'ФИО', value: 'name' },
        { text: 'Должность', value: 'position' },
        { text: 'Подразделение', value: 'division' },
        { text: 'Дата и время', value: 'start' }
      ],
      events: [],
      search: '',
      isLoading: true,
      baseUrl: 'https://corp.polyus.com/medicalrecord/'
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.$sp
        .getListData({
          baseUrl: this.baseUrl,
          listName: 'medicalrecordlist',
          select: 'position,division,datevisit,fio',
          devStaticDataUrl: 'TestData/list-read-example.json'
        })
        .then(results => {
          const events = []

          if (results) {
            for (let i = 0; i < results.length; i++) {
              const first = new Date(results[i].datevisit)
              events.push({
                name: results[i].fio,
                start: this.$moment(first).format('DD-MM-YYYY HH:mm'),
                position: results[i].position,
                division: results[i].division
              })
              this.events = events
            }
            console.log(this.events)
          }
        }).finally(() => (this.isLoading = false))
    }
  }
}
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
