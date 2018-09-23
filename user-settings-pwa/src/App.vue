<template>
  <v-app id="app">
    <settings/>
  </v-app>
</template>
<script>
import Settings from './components/Settings.vue';
import { mapActions, mapGetters } from 'vuex';
export default {
  components: {
    Settings
  },
  methods: {
    ...mapActions(['fetchColor']),
    ...mapGetters(['color' , 'lighting'])
  },
  created() {
    this.fetchColor();
    let theme = {color: this.color, lighting: this.lighting}

    window.glue.contexts.set('globalTheme', theme)
  }
};
</script>

<style lang="scss">
#app {
   font-family: 'Roboto', sans-serif !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
