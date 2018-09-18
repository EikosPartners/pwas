<template>
  <div class="settings">
    <theme-chooser @jsc_theme_change="themeHandler"/>
  </div>
</template>

<script>
import { ThemeChooserComponent } from 'jscatalyst';
export default {
  name: 'Settings',
  components: {
    themeChooser: ThemeChooserComponent
  },
  sockets: {
    connect() {
      console.log('Socket Connected');
    }
  },
  methods: {
    themeHandler(data) {
      this.$socket.emit('themeColor', data);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
