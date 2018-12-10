<template>
  <v-app id="app">
    <div class="container" @drop="handleDrop" @dragenter="handleDragEnter" @dragover="handleDragOver">
      <pwa-header/>
      <heat-map/>
    </div>
  </v-app>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import Windowing from '@/mixins/Windowing';
import ContextMixin from '@/mixins/ContextMixin';
import DragAndDrop from './mixins/DragAndDrop'
import HeatMap from './components/HeatMap'
import PwaHeader from './components/PwaHeader'
export default {
  mixins: [Windowing, ContextMixin, DragAndDrop],
  name: 'app',
  components:{
    heatMap:HeatMap,
    pwaHeader:PwaHeader
  },
  methods: {
    ...mapActions([ 'fetchColor']),
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
