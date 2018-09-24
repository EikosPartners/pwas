let module = null

var metricsMixin = {
    created: function() {
        debugger
        if ( window.glue.metrics !== undefined )
        {
            let metrics = window.glue.metrics
            module = metrics.subSystem('pwa', 'PWAs Metrics')
        }
    },
    methods: {
        // value >=0 <=100 0 - Green, 100 - red
        setState: function(value, text) {
            debugger
            module.setState(value, text)
        }
    }
  };
  
  export default metricsMixin;
  