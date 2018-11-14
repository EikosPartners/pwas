<template>
  <div id="app">
    This app needs to run within the Glue42 environment
    <button @click="debuggerButton">enter debugger</button>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'app',
  methods: {
    ...mapActions(['fetchData', 'fetchColor']),
    debuggerButton(){
        this.$socket.emit("appManaged", window.context)
  
        this.$socket.emit(window.context + "childReady", 'foobar')
        this.$socket.on(window.context + "dataToChild", function (event){
          console.log('dataToChild received')
        })

        // this.$socket.emit()
    }
  },
  created() {
    this.fetchData();
    this.fetchColor();
    console.log('window opened')
  
  },
  mounted(){
    if (window.context) {
  
    }
        
  }
};
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
}
</style>
