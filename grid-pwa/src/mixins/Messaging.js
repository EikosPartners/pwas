var myMixin = {
  created: function() {
    window.glue.contexts.subscribe('filter', (context, delta, removed) => {
      console.log('context update', context.data)
      this.removeFilter();
      this.setQuickFilter(context.data);
      let source = this.formatSource(context.source);
      this.setCurrentFilter(source);
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
