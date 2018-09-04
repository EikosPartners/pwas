<template>
   <heat-map
      @jsc_click="sendFilter"
      :dataModel='data'
      title='D3 Heat Map'
      xaxis-label="date"
      yaxis-label="volume"
    ></heat-map>
</template>
<script>
import { mapGetters } from "vuex";
import { D3HeatMap } from "jscatalyst";

export default {
  name: "",
  components: {
    heatMap: D3HeatMap
  },
  computed: {
    ...mapGetters(["data"])
  },
  sockets: {
    connect: function() {
      console.log("socket connected");
    },
    customEmit: function(val) {
      console.log(
        'this method was fired by the socket server. eg: io.emit("customEmit", data)'
      );
    }
  },
  methods: {
    sendFilter(data) {
      let filterData = {};
      filterData.source = "heatMap";
      filterData.dataSource = "/";
      filterData.data = data.date;
      this.emitFilter(filterData);
    },
    emitFilter: function(val) {
      this.$socket.emit("emitFilter", val);
    }
  }
};
</script>
<style>
</style>
