<template>
  <v-container fluid>
    <v-sheet>
      <v-layout row wrap align-center>
        <v-flex>
          <h2>Запись на прием к терапевту для сотрудников БЦ Баланс (Красноярск)</h2>
        </v-flex>
      </v-layout>

    </v-sheet>
    <v-sheet>
      <v-toolbar flat>
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
    <v-sheet height="800">
      <v-calendar
        ref="calendar"
        v-model="focus"
        color="primary"
        :events="events"
        :event-color="getEventColor"
        :type="type"
        interval-minutes="60"
        interval-count="9"
        first-time="09:00"
        interval-height="77"
        event-height="18"
        :weekdays="weekday"
        locale="RU-ru"
        @click:date="viewDay"
        @click:more="viewDay"
      />
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

              <div>
                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template #activator="{ on, attrs }">
                    <v-text-field
                      v-model="event.dateOfBirth"
                      label="Дата рождения"
                      readonly
                      v-bind="attrs"
                      required
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="event.dateOfBirth"
                    :active-picker.sync="activePicker"
                    :max="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)"
                    min="1950-01-01"
                    @change="saveD"
                  />
                </v-menu>
              </div>

              <v-text-field v-model="event.be" label="БЕ" required />

              <dateTimePicker v-model="event.date" label="Дата посещения" :time-picker-props="timeProps" :date-picker-props="dateProps" required :rules="[v => !!v || 'Поле озязательно для заполнения']" @selectDate="selectDate">
                <template slot="dateIcon">
                  <v-icon> mdi-calendar</v-icon>
                </template>
                <template slot="timeIcon">
                  <v-icon> mdi-clock</v-icon>
                </template>
              </dateTimePicker>
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

import DateTimePicker from '@/components/DatetimePicker.vue'

export default {
  components: { DateTimePicker },
  data: () => ({
    focus: '',
    type: 'month',
    typeToLabel: {
      week: 'Неделя',
      day: 'День',
      month: 'Месяц'
    },
    timeProps: {
      format: '24hr',
      allowedMinutes: m => m % 15 === 0
    },
    dateProps: {
      allowedDates: d => {
        const day = new Date(d).getDay()
        return day === 2 || day === 4
      }
    },
    weekday: [1, 2, 3, 4, 5],
    dialog: false,
    menu: false,
    activePicker: null,
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
      be: '',
      date: null,
      dateOfBirth: null
    },
    calendarDate: null,
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
        this.event.be = ''
      } else {
        this.event.fio = val.FullName
        this.event.login = val.Login
        this.event.be = val.Company
      }
    },
    menu(val) {
      val && setTimeout(() => (this.activePicker = 'YEAR'))
    }
  },
  mounted() {
    this.$refs.calendar.checkChange()
  },
  created() {
    this.getData()
  },
  methods: {
    viewDay({ date }) {
      this.focus = date
      this.type = 'day'
    },
    getEventColor(event) {
      return event.color
    },
    selectDate(d) {
      this.calendarDate = d
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
    saveD(date) {
      this.$refs.menu.save(date)
    },
    getData() {
      this.$sp
        .getListData({
          baseUrl: this.baseUrl,
          listName: 'Terapevt',
          select: 'Title,Date',
          top: 500,
          devStaticDataUrl: 'TestData/list-read-example.json'
        })
        .then(results => {
          const events = []
          if (results) {
            for (let i = 0; i < results.length; i++) {
              const first = new Date(results[i].Date)
              const second = new Date(first.getTime() + 900000)
              events.push({
                name: 'Запись',
                start: first,
                end: second,
                color: this.colors[this.rnd(0, this.colors.length - 1)],
                timed: true
              })
            }
          }
          this.events = events
          console.log(events)
        })
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a
    },
    hideDialog() {
      this.dialog = false
      this.person = null
      this.event.be = ''
      this.event.dateOfBirth = null
      this.event.date = null
    },
    save() {
      if (this.$refs.form.validate()) {
        if (!this.event.date) { return }

        const obj = Object.assign({}, this.event)
        this.hideDialog()
        this.$sp.getFormDigest().then(() => {
          this.$sp.addListItem({
            baseUrl: this.baseUrl,
            listName: 'Terapevt',
            itemData: {
              Title: obj.fio,
              Login: obj.login,
              Date: obj.date,
              Be: obj.be,
              DateOfBirth: obj.dateOfBirth
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
