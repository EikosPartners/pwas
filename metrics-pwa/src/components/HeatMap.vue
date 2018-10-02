<template>
  <heat-map
     v-if="this.data != null"
    :dataType="'other'"
    :dataModel="prettyData"
    :xAxisAngle="65"
  />
</template>

<script>
import { D3HeatMap, StyleTogglerMixin } from 'jscatalyst';
import { mapState, mapActions } from 'vuex';
import jslinq from 'jslinq';
export default {
  name: 'HeatMap',
  mixins: [StyleTogglerMixin],
  components: {
    heatMap: D3HeatMap
  },
  computed: {
    ...mapState(['data']),
    prettyData() {
      const linqData = new jslinq(this.data)
        .select(d => {
          return {
            application: d.application,
            data: d.element.data,
            os: d.os
          };
        })
        .groupBy(d => {
          return d.application;
        });

      let finalData = [];

      linqData.items.forEach(i => {
        let groups = new jslinq(i.elements).groupBy(d => {
          return d.os;
        });
        groups.items.forEach(g => {
          finalData.push({
            x: g.key,
            y: i.key,
            magnitude: g.count
          });
        });
      });

      return finalData;
    },
    themeColorsComp() {
      return Object.values(this.$store.getters.themeColors);
    }
  },
  methods: {
    ...mapActions([])
  }
};
</script>

<style>
</style>
