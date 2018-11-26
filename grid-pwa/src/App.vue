<template>
  <div id="app" :class="computedClass">
    <router-view></router-view>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import { StyleTogglerMixin } from 'jscatalyst';
import Messaging from "@/mixins/Messaging";
import Windowing from "@/mixins/Windowing"

export default {
  name: 'app',
  methods: {
    ...mapActions(['fetchData', 'fetchColor', 'initializeData']),
    ...mapMutations(['setContextId', 'setColor', 'setLighting'])
  },
  mixins: [StyleTogglerMixin, Messaging, Windowing],
  created() {
    
    this.fetchColor();
    if (window.glue) {
      this.subscribe('globalTheme', (context, delta, removed) => {
        console.log("global theme context", context)
        this.setColor(context.color)
        this.setLighting(context.lighting)
      })
      console.log("in not undefined", window.glue)
      if (window.glue.windows.my().context.eventName !== undefined){
        let ctx = window.glue.windows.my().context
        console.log("ctx",ctx)
        this.initializeData(ctx.filter.data)
      }
      else{
        this.fetchData();
        const IdNumber = Date.now();
        this.$store.commit('setContextId', `${IdNumber}`);
        const uniqueName = 'filteredGrid' + IdNumber;
        window.glue.contexts.set(uniqueName, {});
      }
    } else { 
      if (window.context) {
        // this.$store.commit('setContextId', window.context)
        let localThis = this
             this.$socket.on(window.context + "dataToChild", function (data){
               console.log('dataToChild received')
               console.log(data)
               debugger
               localThis.$store.dispatch('initializeData', JSON.parse(data))
             })
              this.$socket.on(window.context + "parentNameToChild", function(data){
                console.log('parent name received')
                debugger
                localThis.$store.commit('setCurrentFilter', data)
              })
             this.$socket.emit("appManaged", window.context)
             this.$socket.emit(window.context + "childReady", 'ready')
      } else {

        this.fetchData();
      }
    }

  },
  computed: {
    ...mapState(['lighting']),
    computedClass() {
      return 'theme--' + this.lighting;
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
  background-color: #303030;
}

.theme--light {
  color: black;
  background-color: white;
}
</style>
