<template>
  <v-app id="app">
    <router-view></router-view>
  </v-app>
</template>

<script>
import { mapActions } from 'vuex';
import {
  ThemeChooserComponent
} from 'jscatalyst';

export default {
  name: 'app',
  methods: {
    ...mapActions(['fetchData', 'fetchColor'])
  },
  created() {
    this.fetchData();
    this.fetchColor();
  },
  components: {
    themeChooser: ThemeChooserComponent
  },

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
