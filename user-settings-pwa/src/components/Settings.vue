<template>
  <div class="settings">
    <toolbar title="User Settings" :logoLight="lightLogo" :logoDark="darkLogo" @jsc_theme_change="themeHandler" @jsc_ld_change="lightingHandler"/>
  </div>
</template>

<script>
import { ThemeChooserComponent, StyleTogglerMixin, Toolbar } from 'jscatalyst';
import { mapState, mapMutations } from 'vuex';
import logoLight from '../../static/ep-logo-yellow.png';
import logoDark from '../../static/ep-logo-black.png';

export default {
  name: 'Settings',
  mixins: [StyleTogglerMixin],
  components: {
    themeChooser: ThemeChooserComponent,
    toolbar: Toolbar
  },
  data() {
    return {
      lightLogo: logoLight,
      darkLogo: logoDark
    };
  },
  computed: {
    ...mapState(['color', 'lighting'])
  },
  sockets: {
    connect() {
      console.log('Socket Connected');
    }
  },
  methods: {
    ...mapMutations(['setColor', 'setLighting']),
    themeHandler(data) {
      this.setColor(data.name)
      //still emit over socket so server is up to date
      this.$socket.emit('themeColor', data);
      //else send over context
      console.log("c: ", data.name, "l: ", this.lighting)
      let theme = {color: data.name, lighting: this.lighting}
      window.glue.contexts.set('globalTheme', theme)
    },
    lightingHandler(data) {
      this.setLighting(data
      )
      //still emit over socket so server is up to date
      this.$socket.emit('themeLighting', data);
      //else send over context
      console.log("c: ", this.color, "l: ", data)
      let theme = {color: this.color, lighting: data}
      window.glue.contexts.set('globalTheme', theme)
    },
    setTheme() {
      this.$store.commit('changeColor', this.color);
      if (this.$store.state.themeMod) {
        this.chooseTheme(this.$store.state.themeMod.colorTheme);
      }
    }
  },
  watch: {
    color(newData) {
      if (newData) {
        this.setTheme();
      }
    },
    lighting(newData) {
      if (newData) {
        console.log("ll", newData)
        this.toggleDark(newData);
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
