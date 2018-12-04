<template>
  <v-app id="app">
    <div class="container" @drop="handleDrop" @dragenter="handleDragEnter" @dragover="handleDragOver">
      <pwa-header/>
      <bubble-chart/>
      <!-- <div>
        <button @click="debuggerButton">Debugger</button>
      </div> -->
    </div>
  </v-app>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import Windowing from '@/mixins/Windowing';
import Messaging from '@/mixins/Messaging';
import DragAndDrop from './mixins/DragAndDrop'
import PwaHeader from './components/PwaHeader'
import BubbleChart from './components/BubbleChart'

export default {
  name: 'app',
  // mixins: [Windowing, Messaging, DragAndDrop],
  components:{
    bubbleChart: BubbleChart,
    pwaHeader: PwaHeader
  },
  methods: {
    ...mapActions(['fetchColor']),
  },
  created() {
    this.fetchColor();
  },
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
