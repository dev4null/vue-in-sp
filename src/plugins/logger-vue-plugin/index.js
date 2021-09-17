/*
  Logger Vue plug-in
  @date 2019-04-26
*/

/*
    Vue installer

    Vue.use(Logger, {
        isActive: process.env.NODE_ENV !== "production",
        propertyName: "$logger",
        listName: "ErrorLogs"
    })

    Access using this.$logger
*/
export default {
  install(Vue, { propertyName, isConsoleActive, spc, listName, saveInterval }) {
    const logger = new Logger({
      isConsoleActive,
      spc,
      listName,
      saveInterval
    })
    if (!propertyName) propertyName = '$logger'
    Object.defineProperty(Vue.prototype, propertyName, { value: logger })
  }
}

class Logger {
  constructor({ isConsoleActive, spc, listName, saveInterval }) {
    this.isActive = true
    this.isConsoleActive = isConsoleActive
    this.spc = spc
    this.listName = listName
    this.saveInterval = saveInterval
    this.messages = []
    if (this.saveInterval) {
      const me = this
      this.saveIntervalTimer = setTimeout(() => {
        me.save()
      }, this.saveInterval)
    } else this.saveIntervalTimer = null
  }

  log(message) {
    if (this.isActive && message) {
      if (typeof message === 'string' && message.length) {
        this.messages.push(message)
        if (this.isConsoleActive) console.log(message)
      } else if (typeof message === 'object') {
        let s = ''
        try {
          s = JSON.stringify(message)
        } catch (e) {
          s = message.toString()
        }
        this.messages.push(s)
        if (this.isConsoleActive) console.log(s)
      } else if (typeof message === 'number') {
        this.messages.push(message.toString())
        if (this.isConsoleActive) console.log(message.toString())
      }
    }
  }

  on() {
    this.isConsoleActive = true
  }

  off() {
    this.isConsoleActive = false
  }

  save(listName) {
    if (!listName) listName = this.listName
    if (this.spc && listName) {
      this.isActive = false
      while (this.messages.length) {
        this.spc.addListItem({
          listName: listName,
          itemData: {
            message: this.messages.shift()
          }
        })
      }
      this.isActive = true
    }
  }

  view(mostRecentCount) {
    for (
      let m = mostRecentCount
        ? Math.max(0, this.messages.length - mostRecentCount)
        : 0;
      m < this.messages.length;
      m++
    ) {
      console.log(this.messages[m])
    }
  }

  clear() {
    this.messages.splice(0)
  }

  destroy() {
    this.clear()
    clearTimeout(this.saveIntervalTimer)
  }
}
