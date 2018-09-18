<template>
  <div class="container">
    <theme-chooser/>
    <bubble-chart 
      :isDate="true" 
      @jsc_click="filterByDateAndSeverity" 
      :dataModel="prettyData" 
      title="Ticket Severity by Date"
      xAxisLabel="date" 
      yAxisLabel="severity"
    ></bubble-chart>
  </div>
</template>

<script>
import {
  D3BubbleChart,
  StyleTogglerMixin,
  ThemeChooserComponent
} from 'jscatalyst';
import { mapGetters, mapActions } from 'vuex';
import jslinq from 'jslinq';
import Messaging from '@/mixins/Messaging';
import Windowing from '@/mixins/Windowing';


export default {
  name: 'BubbleChart',
  components: {
    bubbleChart: D3BubbleChart,
    themeChooser: ThemeChooserComponent
  },
  mixins: [StyleTogglerMixin, Messaging, Windowing],
  data() {
    return {
      gridInstance: false
    };
  },
  computed: {
    ...mapGetters(['data']),
    prettyData() {
      let bubbleData = new jslinq(this.data)
        .select(item => {
          let date = item.date.split('T')[0];
          return {
            date,
            severity: item.severity
          };
        })
        .groupBy(i => {
          return i.date;
        })
        .groupBy(i => {
          let groupedSeverity = i.elements.groupBy(k => {
            return k.severity;
          });
          return groupedSeverity;
        })
        .orderByDescending(i => {
          return i.key;
        });
      let finalData = [];
      bubbleData.items.forEach(set => {
        set.key.forEach(k => {
          finalData.push({
            x: k[0].date,
            y: k.key,
            value: k.length,
            label: 'Date/severity'
          });
        });
      });
      return finalData;
    }
  },
  methods: {
    ...mapActions(['updateData']),
    filterByDateAndSeverity(data) {
      let filter = {};
      filter.source = 'BubbleChart';
      filter.dataSource = '/';
      filter.data = { date: this.parseDate(data.x), severity: data.y };
      filter.time = new Date();
      // console.log(filter);
      // this.$socket.emit('filterByDateAndSeverity', filter);
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
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let year = date.getFullYear();

      if (month < 10) {
        month = '0' + month;
      }
      if (day < 10) {
        day = '0' + day;
      }
      return month + '-' + day + '-' + year;
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
  created() {
    this.$store.commit('changeColor', 'Pink');
    if (this.$store.state.themeMod) {
      this.chooseTheme(this.$store.state.themeMod.colorTheme);
    }

    this.subscribe('filterOnGrid', (context, delta, removed) => {
      console.log('context update', context.data);
      this.output = context.data;
    });
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
