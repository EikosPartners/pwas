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
  mixins: [Windowing, Messaging, DragAndDrop],
  components:{
    bubbleChart: BubbleChart,
    pwaHeader: PwaHeader
  },
  methods: {
    ...mapActions(['fetchData', 'fetchColor']),
    ...mapMutations(['initializeData', 'setBelongsToGrid', 'setSelected', 'setColor', 'setLighting']),
  //   debuggerButton(){
  //    debugger
  //  }
  },
  created() {
    this.fetchColor();
    if (window.glue) {
      this.subscribe('globalTheme', (context, delta, removed) => {
        console.log("global theme context", context)
        this.setColor(context.color)
        this.setLighting(context.lighting)
      })
      const localWindow = window.glue.windows.my();
      const ctx = localWindow.context;
      const contextName = ctx.contextName;
        //this is the grid specific local context it opens with

      if (contextName !== undefined) {
        this.$store.commit('setBelongsToGrid'); //disables socket refresh
        this.$store.commit('setSelected', contextName)
        this.subscribe(contextName, (context, delta, removed) => {
          this.$store.commit('initializeData', context.filter.data);
        });
      }
      if (ctx.filter) {
        this.$store.commit('initializeData', ctx.filter.data);
      } else {
        this.fetchData();
      }
    } else {
      if (window.context) {
           let localThis = this
           
           this.$socket.on(window.context + "dataToChild", function (data){
             console.log('dataToChild received')
             localThis.$store.commit('initializeData', JSON.parse(data))
           })
           this.$socket.emit("appManaged", window.context)
           this.$socket.emit(window.context + "childReady", 'ready')
           this.$store.commit('setBelongsToGrid')
 
         } else {
           this.fetchData();
         }
    }
  },
  sockets: {
    connect(){
      console.log('connected')      
    }
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
