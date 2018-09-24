<template>
  <div id="app" :class="computedClass">
    <router-view/>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
export default {
  name: 'app',
  methods: {
    ...mapActions(['fetchColor'])
  },
  created() {
    this.fetchColor();
  },
  computed: {
    ...mapState(['lighting']),
    computedClass() {
      console.log(this.lighting);
      return 'theme--' + this.lighting;
    }
  }
};
</script>


<style>
* {
  box-sizing: border-box;
}

body {
  font-family: 'Roboto', sans-serif !important;
}

:root {
  font-size: calc(0.3em + 1vw);
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  width: 100%;
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
