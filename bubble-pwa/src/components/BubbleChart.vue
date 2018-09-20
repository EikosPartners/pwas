<template>
  <div class="container">
    <div v-if="!belongsToGrid" class="header">
      <select class="select" v-model="selected">
        <option disabled value="">Select context</option>
        <option v-for="(context, index) in availableContexts" :key="index">{{context}}</option>
      </select>
      <p>Subscribed to: {{selected}}</p>
    </div>
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
import { D3BubbleChart, StyleTogglerMixin } from 'jscatalyst';
import { mapGetters, mapState, mapActions } from 'vuex';
import jslinq from 'jslinq';
import Messaging from '@/mixins/Messaging';
import Windowing from '@/mixins/Windowing';

export default {
  name: 'BubbleChart',
  components: {
    bubbleChart: D3BubbleChart
  },
  mixins: [StyleTogglerMixin, Messaging, Windowing],
  data() {
    return {
      gridInstance: false,
      selected: ''
    };
  },
  computed: {
    ...mapGetters(['data']),
    ...mapState(['color', 'belongsToGrid', 'lighting']),
    availableContexts() {
      let availableContexts = [];
      window.glue.contexts.all().forEach(context => {
        if (context.includes('filteredGrid') && context !== 'filteredGrid') {
          availableContexts.push(context);
        }
      });
      return availableContexts;
    },
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
    ...mapActions(['updateData', 'changeTheme']),
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
    },
    setTheme() {
      this.$store.commit('changeColor', this.color);
      if (this.$store.state.themeMod) {
        this.chooseTheme(this.$store.state.themeMod.colorTheme);
      }
    }
  },
  sockets: {
    connect: function() {
      console.log('socket connected');
      this.$options.sockets.refresh = () => {
        if (!this.belongsToGrid) {
          console.log('refresh!');
          this.updateData();
        }
      };
    },
    themeColor(data) {
      this.changeTheme(data.name);
    },
    themeLighting(data) {
      this.toggleDark();
    }
  },
  watch: {
    color(newData) {
      if (newData) {
        this.setTheme();
      }
    },
    lighting(newData) {
      if (newData) {
        if (newData === 'dark') {
          this.toggleDark();
        }
      }
    },
    selected(newData) {
      if (newData) {
        this.subscribe(newData, (context, delta, removed) => {
          this.$store.commit('initializeData', context.filter.data);
        });
      }
    }
  }
};
</script>

<style>
.container {
  width: 90%;
  padding: 0 5%;
  height: 80vh;
}

.header {
  font-size: 1.5rem;
  padding: 0.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 10vh;
  /* min-height: 60px; */
}

.select {
  padding: 0.3rem 0.6rem;
  font-family: inherit;
  font-size: 1.1rem;
  box-shadow: 0.1rem 0.1rem 0.4rem rgba(0, 0, 0, 0.3);
}

p {
  font-size: 0.9rem;
}
 
</style>
