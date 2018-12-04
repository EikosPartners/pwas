var myMixin = {
  created: function() {
  },
  methods: {

    filter: function(filter, name) {

      if ( window.glue != undefined ) {
        console.log('GLUE42: Filtering message ', filter);
        if ( name !== undefined ) {
          window.glue.contexts.set(name, filter);
        }
        else {
          window.glue.contexts.set('filter', filter);
        }
      }
      else {
        console.log('WEBSockets: Filtering message ' + filter);
        // this.$socket.emit('filterByMonth', filter);
      }
    }
  }
};

export default myMixin;
