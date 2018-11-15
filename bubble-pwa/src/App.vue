<template>
  <v-app id="app">
    <router-view></router-view>
  </v-app>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import Windowing from '@/mixins/Windowing';
import Messaging from '@/mixins/Messaging'; 

export default {
  mixins: [Windowing, Messaging],
  name: 'app',
  methods: {
    ...mapActions(['fetchData', 'fetchColor']),
    ...mapMutations(['initializeData', 'setBelongsToGrid', 'setSelected', 'setColor', 'setLighting']),
    extraMethod(){  
    }
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

.theme--dark {
  color: white;
  background-color: grey;
}

.theme--light {
  color: black;
  background-color: white;
}
</style>
