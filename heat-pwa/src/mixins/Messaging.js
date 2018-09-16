var myMixin = {
    created: function () {
      //this.hello()
    },
    methods: {
        filter: function (filter) {
            alert(filter)
            this.$socket.emit("filterByDate", filter);

            alert(filter)
            window.glue.contexts.update('filter', filter);

            alert(filter)
        },
      hello: function (filter) {

        this.$socket.emit("filterByDate", filter);

        window.glue.contexts.update('filter', filter);
      }
    }
  }

  export default myMixin