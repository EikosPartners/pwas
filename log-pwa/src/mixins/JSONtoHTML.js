var myMixin = {
  computed: {
    jsonString() {
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
      let html = '<ul class="data-container">';
      keys.forEach(key => {
        // debugger
        html += this.handleKey(key, jsonObject);
      });
      html += "</ul>";
      return html;
    },
    handleKey(key, jsonObject) {
      if (typeof jsonObject[`${key}`] !== "object") {
        // debugger
        return `<li><span class="key">${this.formatText(key)}:</span><span class="value">${jsonObject[`${key}`]}</span></li>`;
      } else {
        // debugger
        return this.jsonToHTML(jsonObject[`${key}`]);
      }
    }
  }
};

export default myMixin