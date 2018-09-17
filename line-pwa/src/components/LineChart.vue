<template>
    <div class="container">
      <theme-chooser @jsc_theme_change="themeHandler"/>
      <line-chart 
        @jsc_click="filterByDate" 
        title="Ticket Severity by Date" 
        :dataModel="dataDV"
      ></line-chart>
    </div>
</template>

<script>
import {
  D3LineChart,
  StyleTogglerMixin,
  ThemeChooserComponent
} from 'jscatalyst';
import { mapGetters, mapState, mapActions } from 'vuex';

export default {
  name: 'LineChart',
  components: {
    lineChart: D3LineChart,
    themeChooser: ThemeChooserComponent
  },
  computed: {
    ...mapState(['color']),
    ...mapGetters(['dataDV'])
  },
  sockets: {
    connect: function() {
      console.log('socket connected');
      this.$options.sockets.themeColor = data => {
        this.changeTheme(data.name);
      };
    }
  },
  methods: {
    ...mapActions(['changeTheme']),
    filterByDate(data) {
      let filter = {};
      filter.source = 'lineChart';
      filter.dataSource = '/';
      filter.data = this.formatDate(data.date);
      filter.time = new Date();
      console.log(filter);
      this.emitFilter(filter);
    },
    emitFilter: function(data) {
      this.$socket.emit('filterByDate', data);
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
    themeHandler(event) {
      this.$socket.emit('themeColor', event);
    },
    setTheme() {
      this.$store.commit(this.color.action, this.color.color);
      if (this.$store.state.themeMod) {
        this.chooseTheme(this.$store.state.themeMod.colorTheme);
      }
    }
  },
  mixins: [StyleTogglerMixin],
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

