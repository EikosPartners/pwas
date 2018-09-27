var myMixin = {
  computed: {
    jsonString() {
      return this.jsonToHTML(this.ctxInfo);
    }
  },
  methods: {
    jsonToHTML(jsonObject) {
      let keys = Object.keys(jsonObject)
      let html = keys.map(key => {
        // debugger
        return this.handleKey(key, jsonObject)
      })
      return html.join(' ')
    },
    handleKey(key, jsonObject) {
      if (typeof jsonObject[`${key}`] !== 'object') {
        // debugger
        return `<div><span>${key}:</span><span>${jsonObject[`${key}`]}</span></div>`
      }
      else {
        // debugger
        return this.jsonToHTML(jsonObject[`${key}`])
      }
    }
  },
};

export default myMixin