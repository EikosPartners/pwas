<template>
    <div class="container">        
      <pie-chart :dataModel="prettyData"  @jsc_click="filterByProject" title="Tickets per Project"/>
    </div>
</template>

<script>
import { D3PieChart, StyleTogglerMixin } from 'jscatalyst';
import { mapGetters, mapState, mapActions } from 'vuex';
import jslinq from 'jslinq';
import Messaging from '@/mixins/Messaging';
import Windowing from '@/mixins/Windowing';


export default {
  name: 'PieChart',
  components: {
    pieChart: D3PieChart
  },
  mixins: [StyleTogglerMixin, Messaging, Windowing],
  data() {
    return {
      gridInstance: false
    };
  },
  computed: {
    ...mapState(['color', 'themeTrigger','belongsToGrid']),
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
    ...mapActions(['updateData', 'changeTheme']),
    filterByProject(data) {
      let filter = {};
      filter.source = 'PieChart';
      filter.dataSource = '/';
      filter.data = data.data.label;
      filter.time = new Date();
      // console.log(filter);

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
      this.$options.sockets.themeColor = data => {
        this.changeTheme(data.name);
      };
    }
  },
  created() {
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
<style >
.container {
  width: 90%;
  padding: 0 5%;
  height: 90vh;
}
</style>
