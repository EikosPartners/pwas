<template>
  <v-app id="app">
    <div class="container" @drop="handleDrop" @dragenter="handleDragEnter" @dragover="handleDragOver">
      <pwa-header/>
      <bar-chart/>
    </div>
  </v-app>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import Windowing from '@/mixins/Windowing';
import Messaging from '@/mixins/Messaging';
import DragAndDrop from './mixins/DragAndDrop'
import BarChart from './components/BarChart'
import PwaHeader from './components/PwaHeader'

export default {
  name: 'app',
  mixins: [Windowing, Messaging, DragAndDrop],
  components:{
    barChart: BarChart,
    pwaHeader: PwaHeader
  },
  methods: {
    ...mapActions(['fetchData', 'fetchColor']),
    ...mapMutations(['initializeData', 'setBelongsToGrid', 'setSelected', 'setColor', 'setLighting'])
  },
  created() {
    this.fetchColor();
   
  }
};
</script>

<style>
body {
  font-family: 'Roboto', sans-serif !important;
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
}

* {
  box-sizing: border-box;
}

:root {
  font-size: calc(0.3em + 1vw);
}

.container {
  width: 90%;
  padding: 0 5%;
  height: 80vh;
}

.theme--dark {
  color: white;
  background-color: grey;
}

.theme--light {
  color: black;
  background-color: white;
}
</style>
