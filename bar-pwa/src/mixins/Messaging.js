var myMixin = {
  created: function() {
  },
  methods: {
    // Subscribe to the named event passed in
    subscribe: function(name, subscriber) {
      window.glue.contexts.subscribe(name, (context, delta, removed) => {
        if ( subscriber !== undefined ) {
          subscriber(context, delta, removed)
        }
      })
    },
    filter: function(filter, name) {

      if ( window.glue != undefined ) {
        console.log('GLUE42: Filtering message ' + filter);
        if ( name !== undefined ) {
          window.glue.contexts.set(name, filter);
        }
        else {
          window.glue.contexts.set('filter', filter);
        }
      }
      else {
        console.log('WEBSockets: Filtering message ' + filter);
        this.$socket.emit('filterByMonth', filter);
      }
    }
  }
};

export default myMixin;
