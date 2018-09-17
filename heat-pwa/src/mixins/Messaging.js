var myMixin = {
  created: function() {
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
    },
  }
};

export default myMixin;
