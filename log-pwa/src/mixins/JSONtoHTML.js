var myMixin = {
  computed: {
    jsonString() {
      console.log(this.ctxInfo)
      return this.jsonToHTML(this.ctxInfo);
    }
  },
  methods: {
    formatText(text) {
      let withSpaces = text.replace(/([A-Z0-9]+)/g, " $1");
      return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
    },
    jsonToHTML(jsonObject) {
      let keys = Object.keys(jsonObject);
      let html = '<ul class="data-container ul-comp">';
      keys.forEach(key => {
        html += this.handleKey(key, jsonObject);
      });
      html += "</ul>";
      return html;
    },
    handleKey(key, jsonObject) {
      if (typeof jsonObject[`${key}`] !== "object") {
        return `<li class="li-comp"><span class="key">${this.formatText(key)}:</span><span class="value">${jsonObject[`${key}`]}</span></li>`;
      } else {
        return this.jsonToHTML(jsonObject[`${key}`]);
      }
    }
  }
};

export default myMixin