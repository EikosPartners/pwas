var myMixin = {
    created: function () {
      //this.hello()
      window.glue.contexts.subscribe("filter", (context, delta, removed) => {
        this.output = context.data
      })
    },
    data() {
      return {
        output: "initial"
      }
    },
    methods: {
      filter: function (filter) {
          // alert(filter)
          this.$socket.emit("filterByDate", filter);

          // alert(filter)
          window.glue.contexts.update('filter', filter);

          // alert(filter)
      },
      hello: function (filter) {

        this.$socket.emit("filterByDate", filter);

        window.glue.contexts.update('filter', filter);
      }
    }
  }

  export default myMixin