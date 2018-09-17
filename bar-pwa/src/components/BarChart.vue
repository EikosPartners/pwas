<template>
  <div class="container">
    <theme-chooser/>
    <bar-chart
      @jsc_click="filterByMonth"
      :dataModel='prettyData'
      title='Number of Tickets by Month'
      xaxisLabel="Date"
      yaxisLabel="Number of Tickets"
      :xAxisAngle='0'
    ></bar-chart>
  </div>
</template>
<script>
import { mapGetters, mapState, mapActions } from 'vuex';
import {
  D3BarChart,
  StyleTogglerMixin,
  ThemeChooserComponent
} from 'jscatalyst';
import jslinq from 'jslinq';

export default {
  name: 'BarChart',
  components: {
    barChart: D3BarChart,
    themeChooser: ThemeChooserComponent
  },
  mixins: [StyleTogglerMixin],
  computed: {
    ...mapGetters(['data', 'height']),
    ...mapState(['color']),
    barData() {
      const barData = [];
      let sorted = this.sortData(this.data);
      for (let date in sorted) {
        let dataObj = { x: date, y: sorted[date] };
        barData.push(dataObj);
      }
      return barData;
    },
    prettyData() {
      let barData = [];
      let sorted = this.sortData(this.data);
      for (let year in sorted) {
        let oneYearData = [];
        for (let month in sorted[year]) {
          let date = month + '/' + year;
          let dataObj = { x: date, y: sorted[year][month] };

          oneYearData.push(dataObj);
        }
        oneYearData.sort((a, b) => {
          let val1 = parseInt(a.x.split('/')[0]);
          let val2 = parseInt(b.x.split('/')[0]);

          return val1 - val2;
        });

        barData = barData.concat(oneYearData); //why no work???
      }

      return barData;
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
    filterByMonth(data) {
      let filter = {};
      filter.source = 'barChart';
      filter.dataSource = '/';
      filter.data = data.x;
      filter.time = new Date();
      console.log('filter', filter);
      this.$socket.emit('filterByMonth', filter);
    },
    parseDate(date) {
      let dateA = date.split('T')[0].split('-');
      return dateA[1] + '-' + dateA[2] + '-' + dateA[0];
    },
    sortData(rawData) {
      const groupedData = {};
      rawData.forEach(item => {
        let date = this.parseDate(item.date);
        let year = this.parseYear(date);
        let month = this.parseMonth(date);
        if (Object.keys(groupedData).includes(year)) {
          if (groupedData[year][month]) {
            groupedData[year][month] += 1;
          } else {
            groupedData[year][month] = 1;
          }
        } else {
          groupedData[year] = {};
        }
      });
      return groupedData;
    },
    parseYear(date) {
      let year = date.split('-')[2];
      return year;
    },
    parseMonth(date) {
      let month = date.split('-')[0];
      return month;
    }
  },
  watch: {
    color(newData) {
      if (newData) {
        this.$store.commit(this.color.action, this.color.color);
        if (this.$store.state.themeMod) {
          this.chooseTheme(this.$store.state.themeMod.colorTheme);
        }
      }
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
