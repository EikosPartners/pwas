var myMixin = {
  created: function() {
    window.glue.contexts.subscribe('filter', (context, delta, removed) => {
      console.log('context update', context.data)
      this.output = context.data
    })
  },
  methods: {
    filter: function(filter) {

      if ( window.glue != undefined ) {
        alert('GLUE42: Filtering message ' + filter);
        window.glue.contexts.update('filter', filter);
      }
      else {
        alert('WEBSockets: Filtering message ' + filter);
        this.$socket.emit('filterByDate', filter);
      }
    }
  }
};

export default myMixin;
