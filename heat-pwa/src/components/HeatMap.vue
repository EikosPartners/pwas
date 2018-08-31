<template>
   <heat-map
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
  methods: {}
};
</script>
<style>
</style>
