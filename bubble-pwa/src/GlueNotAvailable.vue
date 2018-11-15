<template>
  <div id="app">
    This app needs to run within the Glue42 environment
    <div>
      <button @click="debuggerButton">debugger</button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'app',
  methods: {
    ...mapActions(['fetchData', 'fetchColor']),
    debuggerButton(){
      // all of this needs to be moved to an actual component / mixin - just here for dev purposes 
      debugger

    }
  },
  created() {
    this.fetchData();
    this.fetchColor();
  
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
