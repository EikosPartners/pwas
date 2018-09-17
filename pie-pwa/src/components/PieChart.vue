<template>
    <div class="container">
          <theme-chooser/>
        
          <pie-chart
          :dataModel="prettyData" 
          @jsc_click="filterByProject"
          title="Tickets per Project"
          ></pie-chart>

    </div>
</template>

<script>
import {
  D3PieChart,
  StyleTogglerMixin,
  ThemeChooserComponent
} from 'jscatalyst';
import { mapGetters, mapState, mapActions } from 'vuex';
import jslinq from 'jslinq';

export default {
  name: 'PieChart',
  components: {
    pieChart: D3PieChart,
    themeChooser: ThemeChooserComponent
  },
  mixins: [StyleTogglerMixin],

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
    ...mapActions(['updateData']),
    filterByProject(data) {
      let filter = {};
      filter.source = 'PieChart';
      filter.dataSource = '/';
      filter.data = data.data.label;
      filter.time = new Date();
      console.log(filter);
      this.$socket.emit('filterByProject', filter);
    }
  },
  sockets: {
    connect: function() {
      console.log('socket connected');
      this.$options.sockets.refresh = () => {
        console.log('refresh!');
        this.updateData();
      };
    }
  },

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
<style >
.container {
  width: 90%;
  padding: 0 5%;
  height: 90vh;
}
</style>
