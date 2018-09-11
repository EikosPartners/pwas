<template>
<div style="height: 400px">
  <pie-chart  :dataModel="prettyData" @jsc_click="filterByProject"/>
</div>
</template>

<script>
import { D3PieChart, StyleTogglerMixin } from 'jscatalyst';
import { mapGetters, mapState } from 'vuex';
import jslinq from 'jslinq';

export default {
  name: 'PieChart',
  components: {
    pieChart: D3PieChart
  },
  computed: {
    ...mapState(['color']),
    ...mapGetters(['data']),
    prettyData() {
      const pieLinqData = new jslinq(this.data)
        .select(d => {
          return {
            label: d.project,
            value: d.severity
          };
        })
        .groupBy(d => {
          return d.label;
        });
      let temp = pieLinqData.items.map(i => {
        return i;
      });
      const finalData = [];
      temp.forEach(i => {
        finalData.push({
          label: i.key,
          value: i.count
        });
      });
      return finalData;
    }
  },
  methods: {
    filterByProject(data) {
      let filter = {};
      filter.source = 'PieChart';
      filter.dataSource = '/';
      filter.data = data.data.label;
      console.log(filter);
      this.$socket.emit('filterByProject', filter);
    }
  },
  sockets: {
    connect: function() {
      console.log('socket connected');
    }
  },
  mixins: [StyleTogglerMixin],
  watch: {
    color(newData) {
      console.log(newData);

      if (newData) {
        this.$store.commit(this.color.action, this.color.color);
        if (this.$store.state.themeMod) {
          this.chooseTheme(this.$store.state.themeMod.colorTheme);
        }
        // this.color;
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
</style>
