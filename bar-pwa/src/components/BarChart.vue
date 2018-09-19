<template>
  <div class="container">
    <bar-chart
      @jsc_click="filterByMonth"
      :dataModel='prettyData'
      title='Number of Tickets by Month'
      xaxisLabel="Date"
      yaxisLabel="Number of Tickets"
      :xAxisAngle='45'
    ></bar-chart>
  </div>
</template>
<script>
import { mapGetters, mapState, mapActions } from 'vuex';
import { D3BarChart, StyleTogglerMixin } from 'jscatalyst';
import jslinq from 'jslinq';
import Messaging from '@/mixins/Messaging';
import Windowing from '@/mixins/Windowing';

export default {
  name: 'BarChart',
  components: {
    barChart: D3BarChart
  },
  mixins: [StyleTogglerMixin, Messaging, Windowing],
  data() {
    return {
      gridInstance: false
    };
  },
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
      debugger
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
      this.$options.sockets.themeColor = data => {
        console.log('fetchColor recieved', data);
        this.changeTheme(data.name);
      };
    },
    themeColor: function(data) {
        debugger
        console.log('fetchColor recieved', data);
        this.changeTheme(data.name);
    }
  },
  methods: {
    ...mapActions(['updateData', 'fetchColor', 'changeTheme']),
    filterByMonth(data) {
      let filter = {};
      filter.source = "BarChart";
      filter.dataSource = '/';
      filter.data = data.x;
      filter.time = new Date();
      // console.log('filter', filter);

      this.filter(filter, 'filterOnGrid');

      // this.openContextWindow('Filter Results', 'http://localhost:9093', filter)

      // A Named object
      if (this.gridInstance === true) {
        debugger;
        // Can we pass the instance an updated context here?
      } else {
        let app = window.glue.appManager.application('JSCDataGrid');
        const localWindow = window.glue.windows.my();
        const localThis = this;
        let windowConfig = {
          relativeTo: localWindow.id,
          relativePosition: 'right'
        };
        // let windowConfig = { }

        // Launch the app and then wait for the return so that we can grab the instance Id
        app
          .start({ filter: filter, eventName: 'filterOnGrid' }, windowConfig)
          .then(instance => {
            //localThis.gridInstance = instance
          });

        this.gridInstance = true;
      }
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
    },
    setTheme() {
      this.$store.commit('changeColor', this.color);
      if (this.$store.state.themeMod) {
        this.chooseTheme(this.$store.state.themeMod.colorTheme);
      }
    }
  },
  created() {
    console.log(this.themeColorsComp);
    // this.$store.commit('changeColor', 'Red');
    // if (this.$store.state.themeMod) {
    //   this.chooseTheme(this.$store.state.themeMod.colorTheme);
    // }

    this.subscribe('filterOnGrid', (context, delta, removed) => {
      console.log('context update', context.data);
      this.output = context.data;
    });
  },
  watch: {
    color(newData) {
      if (newData) {
        this.setTheme();
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
