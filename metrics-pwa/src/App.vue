<template>
  <v-app id="app" :class="computedClass">
    <router-view></router-view>
  </v-app>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import { StyleTogglerMixin } from 'jscatalyst';

export default {
  name: 'app',
  methods: {
    ...mapActions(['fetchData', 'fetchColor']),
    ...mapMutations(['setContextId'])
  },
  mixins: [StyleTogglerMixin],
  created() {
    this.fetchColor();
    this.fetchData();
    const IdNumber = Date.now();
    this.$store.commit('setContextId', `${IdNumber}`);
    const uniqueName = 'filteredGrid' + IdNumber;
    window.glue.contexts.set(uniqueName, {});
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
