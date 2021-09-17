<template>
  <v-container fluid>
    <v-sheet height="64">
      <v-toolbar flat>
        <v-btn
          outlined
          class="mr-4"
          color="grey darken-2"
          to="/list"
        >
          Список
        </v-btn>
        &nbsp;
        <v-btn
          outlined
          class="mr-4"
          color="grey darken-2"
          @click="setToday"
        >
          Сегодня
        </v-btn>
        <v-btn
          fab
          text
          small
          color="grey darken-2"
          @click="prev"
        >
          <v-icon small>
            mdi-chevron-left
          </v-icon>
        </v-btn>
        <v-btn
          fab
          text
          small
          color="grey darken-2"
          @click="next"
        >
          <v-icon small>
            mdi-chevron-right
          </v-icon>
        </v-btn>
        <v-toolbar-title v-if="$refs.calendar">
          {{ $refs.calendar.title }}
        </v-toolbar-title>
        <v-spacer />
        <v-menu
          bottom
          right
        >
          <template #activator="{ on, attrs }">
            <span>
              <v-btn
                outlined
                color="grey darken-2"
                v-bind="attrs"
                v-on="on"
              >
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>
                  mdi-menu-down
                </v-icon>
              </v-btn>
              &nbsp;
              <v-btn color="primary" dark @click="dialog = true">
                Создать
              </v-btn>
            </span>
          </template>
          <v-list>
            <v-list-item @click="type = 'day'">
              <v-list-item-title>День</v-list-item-title>
            </v-list-item>
            <v-list-item @click="type = 'week'">
              <v-list-item-title>Неделя</v-list-item-title>
            </v-list-item>
            <v-list-item @click="type = 'month'">
              <v-list-item-title>Месяц</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar>
    </v-sheet>
    <v-sheet height="600">
      <v-calendar
        ref="calendar"
        v-model="focus"
        color="primary"
        :events="events"
        :event-color="getEventColor"
        :type="type"
        interval-minutes="20"
        interval-count="48"
        first-time="04:00"
        locale="RU-ru"
        weekdays="[1, 2, 3, 4, 5, 6, 0]"
        event-more-text="Еще {0}"
        @click:event="showEvent"
        @click:more="viewDay"
        @click:date="viewDay"
      />
      <v-menu
        v-model="selectedOpen"
        :close-on-content-click="false"
        :activator="selectedElement"
        offset-x
      >
        <v-card
          color="grey lighten-4"
          min-width="350px"
          flat
        >
          <v-toolbar :color="selectedEvent.color" dark>
            <v-toolbar-title v-html="selectedEvent.name" />
            <v-spacer />
          </v-toolbar>
          <v-card-text>
            <span> {{ selectedEvent.position }} </span> <v-spacer />
            <span> {{ selectedEvent.division }}  </span> <v-spacer />
            <span> {{ selectedEvent.start | moment('HH:mm') }} </span> <v-spacer />
          </v-card-text>
          <v-card-actions>
            <v-btn
              text
              color="secondary"
              @click="selectedOpen = false"
            >
              Cancel
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-sheet>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="900px"
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">Создание записи</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form
              ref="form"
              v-model="valid"
              lazy-validation
            >
              <v-autocomplete
                v-model="person"
                :items="items"
                :loading="isLoading"
                :search-input.sync="search"
                color="white"
                hide-selected
                item-text="FullName"
                label="ФИО"
                placeholder="Веедите фамилию"
                return-object
                required
                :rules="[v => !!v || 'Поле озязательно для заполнения']"
              />

              <v-text-field v-model="event.tabNum" label="Табельный" required />
              <v-text-field v-model="event.position" label="Должность" />
              <v-text-field v-model="event.division" label="Подразделение" required />

              <v-datetime-picker v-model="event.dateTime" label="Дата посещения" :time-picker-props="timeProps" required :rules="[v => !!v || 'Поле озязательно для заполнения']">
                <template slot="dateIcon">
                  <v-icon> mdi-calendar</v-icon>
                </template>
                <template slot="timeIcon">
                  <v-icon> mdi-clock</v-icon>
                </template>
              </v-datetime-picker>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue darken-1"
            text
            @click="hideDialog"
          >
            Отмена
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="save"
          >
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      :timeout="-1"
      :value="alert"
      absolute
      top
    >
      {{ alertText }}
    </v-snackbar>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    focus: '',
    type: 'month',
    typeToLabel: {
      month: 'Месяц',
      week: 'Неделя',
      day: 'День'
    },
    timeProps: {
      format: '24hr',
      allowedMinutes: m => m % 6 === 0
    },
    dialog: false,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    alertType: '',
    alert: false,
    alertText: '',
    events: [],
    colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
    event: {
      fio: '',
      login: '',
      position: '',
      division: '',
      tabNum: '',
      dateTime: null
    },
    valid: true,
    person: null,
    isLoading: false,
    select: null,
    search: null,
    items: [],
    baseUrl: 'https://corp.polyus.com/medicalrecord/'
  }),
  watch: {
    search(val) {
      if (val && val.length < 3) { return }
      if (this.isLoading) { return }

      this.isLoading = true

      fetch(`https://servise-ad.polyus.com/Users/GetUserByDisplayName?partDisplayName=${decodeURI(val)}&loadAllProperties=false`, {
        method: 'POST' })
        .then(res => res.json())
        .then(res => {
          this.items = res
        })
        .catch(err => {
          console.log(err)
          this.items = []
        })
        .finally(() => (this.isLoading = false))
    },
    person(val) {
      if (!val) {
        this.event.fio = ''
        this.event.login = ''
        this.event.position = ''
        this.event.division = ''
      } else {
        this.event.fio = val.FullName
        this.event.login = val.Login
        this.event.position = val.JobTitle
        this.event.division = val.Department
      }
    }

  },
  mounted() {
    this.$refs.calendar.checkChange()
  },
  created() {
    this.getData()
  },
  methods: {
    allowedStep: m => m % 6 === 0,
    viewDay({ date }) {
      this.focus = date
      this.type = 'day'
    },
    getEventColor(event) {
      return event.color
    },
    setToday() {
      this.focus = ''
    },
    prev() {
      this.$refs.calendar.prev()
    },
    next() {
      this.$refs.calendar.next()
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        // requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true))
      }

      if (this.selectedOpen) {
        this.selectedOpen = false
        requestAnimationFrame(() => requestAnimationFrame(() => open()))
      } else {
        open()
      }

      nativeEvent.stopPropagation()
    },
    getData() {
      this.$sp
        .getListData({
          baseUrl: this.baseUrl,
          listName: 'medicalrecordlist',
          select: 'Title,Login,position,division,datevisit,fio',
          devStaticDataUrl: 'TestData/list-read-example.json'
        })
        .then(results => {
          const events = []

          if (results) {
            for (let i = 0; i < results.length; i++) {
              const first = new Date(results[i].datevisit)
              const second = new Date(first.getTime() + 360000)
              events.push({
                name: results[i].fio,
                start: first,
                end: second,
                color: this.colors[this.rnd(0, this.colors.length - 1)],
                timed: true,
                position: results[i].position,
                division: results[i].division
              })
              this.events = events
            }
          }
        })
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a
    },
    hideDialog() {
      this.dialog = false
      this.person = null
      this.event.tabNum = ''
    },
    save() {
      if (this.$refs.form.validate()) {
        if (!this.event.dateTime) { return }

        const obj = Object.assign({}, this.event)
        this.hideDialog()
        this.$sp.getFormDigest().then(() => {
          this.$sp.addListItem({
            baseUrl: this.baseUrl,
            listName: 'medicalrecordlist',
            itemData: {
              Title: obj.tabNum,
              Login: obj.login,
              position: obj.position,
              division: obj.division,
              datevisit: obj.dateTime,
              fio: obj.fio
            }

          }).then(() => {
            this.getData()
            this.showAlert('Запись добавлена')
          // could show a "Saved." message
          })
            .catch(error => {
              console.log(error.response)

              if (error.response && error.response.data && error.response.data.error && error.response.data.error) { this.showAlert(error.response.data.error.message.value) }
            })
        })
      }
    },
    showAlert(text) {
      this.alertText = text
      this.alert = true

      setTimeout(() => {
        this.alert = false
      }, 5000)
    }
  }
}
</script>
