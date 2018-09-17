<template>
  <v-app id="app">
    <router-view/>
  </v-app>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  created() {
    this.fetchData();
    this.fetchColor();
  },
  methods: {
    ...mapActions(['fetchData', 'fetchColor'])
  }
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
}
</style>
