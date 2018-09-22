<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "app",
  methods: {
    ...mapActions(["fetchColor"])
  },
   created() {
    this.fetchColor();
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
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /* color: #2c3e50; */
  width: 100%;
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
