<template>
<div class="container">
  <theme-chooser/>
   <heat-map
      v-if="themeColorsComp.length > 0"
      @jsc_click="filterByDate"
      :dataModel='heatData'
      title='Number of Tickets by Date'
      xaxis-label="date"
      yaxis-label="volume"
    ></heat-map>
  </div>
</template>
<script>
import { mapGetters, mapState, mapActions } from 'vuex';
import {
  D3HeatMap,
  StyleTogglerMixin,
  ThemeChooserComponent
} from 'jscatalyst';
import Messaging from '@/mixins/Messaging';

export default {
  name: 'HeatMap',
  components: {
    heatMap: D3HeatMap,
    themeChooser: ThemeChooserComponent
  },
  mixins: [StyleTogglerMixin, Messaging],
  computed: {
    ...mapGetters(['data']),
    ...mapState(['color']),
    heatData() {
      const heatData = [];
      let sorted = this.sortData(this.data);
      for (let date in sorted) {
        let dataObj = { date: date, volume: sorted[date] };
        heatData.push(dataObj);
      }
      return heatData;
    },
    themeColorsComp() {
      return this.$store.state.themeMod.themeColors;
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
  methods: {
    ...mapActions(['updateData']),
    filterByDate(data) {
      let filter = {};
      filter.source = 'heatMap';
      filter.dataSource = '/';
      filter.data = this.parseDate(data.date);
      filter.time = new Date();
      console.log(filter);

      this.filter(filter);
    },
    parseDate(date) {
      const dateArray = date.split('-');
      return dateArray[1] + '-' + dateArray[2] + '-' + dateArray[0];
    },
    sortData(rawData) {
      const groupedData = {};
      rawData.forEach(item => {
        let justDate = item.date.split('T');
        let date = justDate[0];
        if (Object.keys(groupedData).includes(date)) {
          groupedData[date] += 1;
        } else {
          groupedData[date] = 1;
        }
      });
      return groupedData;
    }
  },
  created() {
    console.log(this.themeColorsComp);
    // this.$store.commit('changeColor', 'Red');
    // if (this.$store.state.themeMod) {
    //   this.chooseTheme(this.$store.state.themeMod.colorTheme);
    // }
  },
  watch: {
    color(newData) {
      if (newData) {
        this.$store.commit(this.color.action, this.color.color);
        if (this.$store.state.themeMod) {
          this.chooseTheme(this.$store.state.themeMod.colorTheme);
        }
      }
    },
    themeColorsComp(well) {
      this.draw;
    }
  }
};
</script>
<style>
.container {
  width: 90%;
  padding: 0 5%;
  height: 90vh;
}
</style>
