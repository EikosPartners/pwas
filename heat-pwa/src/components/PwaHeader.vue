<template>
  <div :class="['header']" :style="styleObj">
      <span>{{title}}</span>
      <span class="current-context" v-if="inGlue && selected !== ''">Subscribed:
        <span>{{selected.split('d')[2]}}</span>
      </span>
      <span v-else-if="inGlue && selected == ''">Unsubscribed</span>
        <span class="current-context" v-else>Subscribed:
        <select class="select" v-model="selected" v-on:click="populate">
          <option disabled value="">Select context</option>
          <option v-for="(context, index) in availableContexts" :value="context" :key="index">{{context}}</option>
        </select>
      </span>
    </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex';
import { StyleTogglerMixin } from 'jscatalyst';
import DragAndDrop from '@/mixins/DragAndDrop';

export default {
  name: "PwaHeader",
  props: ['title', 'availableContexts'],
  mixins: [StyleTogglerMixin, DragAndDrop],
  computed: {
    ...mapGetters(['themeColors']),
    ...mapState(['color', 'lighting']),
    styleObj(){
      let background, text
      if (this.$store.state.themeMod.displayTheme === 'light') {
        background = this.themeColors.vuetifyLight
        text = '#000'
      } else {
        background = this.themeColors.vuetifyDark
        text = '#fff'
      }
      return {backgroundColor: background, color: text}
    },
    selected: {
      get() {
        return this.$store.state.selected
      },
      set(value) {
        this.$store.commit('setSelected', value)
      }
    }
  },
  methods: {
    ...mapActions(['changeTheme']),
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
        if (newData === 'dark') {
          this.toggleDark();
        }
      }
    },
    selected(newData) {
      if (newData) {
        this.subscribe(newData, (context, delta, removed) => {
          this.$store.commit('initializeData', context.filter.data);
        });
      }
    }
  }
}
</script>

