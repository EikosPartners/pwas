<template>
    <div class="container">
    <div v-if="!belongsToGrid" class="header">
      <select class="select" v-model="selected">
        <option disabled value="">Select context</option>
        <option v-for="(context, index) in availableContexts" :key="index">{{context}}</option>
      </select>
      <p>Subscribed to: {{selected}}</p>
    </div>
      <line-chart 
        @jsc_click="filterByDate" 
        title="Ticket Severity by Date" 
        :dataModel="dataDV"
      />
    </div>
</template>

<script>
import { D3LineChart, StyleTogglerMixin } from 'jscatalyst';
import { mapGetters, mapState, mapActions } from 'vuex';
import Messaging from '@/mixins/Messaging';
import Windowing from '@/mixins/Windowing';

export default {
  name: 'LineChart',
  components: {
    lineChart: D3LineChart
  },
  mixins: [StyleTogglerMixin, Messaging, Windowing],
  data() {
    return {
      gridInstance: false,
      selected: ''
    };
  },
  computed: {
    ...mapState(['color', 'belongsToGrid', 'lighting']),
    ...mapGetters(['dataDV']),
    availableContexts() {
      let availableContexts = [];
      window.glue.contexts.all().forEach(context => {
        if (context.includes('filteredGrid') && context !== 'filteredGrid') {
          availableContexts.push(context);
        }
      });
      return availableContexts;
    }
  },
  sockets: {
    connect: function() {
      console.log('socket connected');
      this.$options.sockets.themeColor = data => {
        this.changeTheme(data.name);
      };
      this.$options.sockets.refresh = () => {
        if (!this.belongsToGrid) {
          console.log('refresh!');
          this.updateData();
        }
      };
    },
    themeLighting() {
      this.toggleDark();
    }
  },
  methods: {
    ...mapActions(['changeTheme', 'updateData']),
    filterByDate(data) {
      let filter = {};
      filter.source = 'lineChart';
      filter.dataSource = '/';
      filter.data = this.formatDate(data.date);
      filter.time = new Date();

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
    formatDate(dateObj) {
      let date = new Date(dateObj);
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let year = date.getFullYear();
      if (day < 10) {
        day = '0' + day;
      }
      if (month < 10) {
        month = '0' + month;
      }
      return `${month}-${day}-${year}`;
    },
    setTheme() {
      this.$store.commit('changeColor', this.color);
      if (this.$store.state.themeMod) {
        this.chooseTheme(this.$store.state.themeMod.colorTheme);
      }
    }
  },
  // created() {
  //   this.subscribe('filterOnGrid', (context, delta, removed) => {
  //     console.log('context update', context.data);
  //   });
  // },
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
 
<style >
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

