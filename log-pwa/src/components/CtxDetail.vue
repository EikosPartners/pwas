<template>
  <div class="context-detail" v-html="jsonString"></div>
</template>
<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
import { StyleTogglerMixin } from 'jscatalyst';
import Messaging from '@/mixins/Messaging';
import Windowing from '@/mixins/Windowing';

export default {
  name: 'ContextDetail',
  mixins: [Messaging, Windowing, StyleTogglerMixin],
  props: ['contextName'],
  data() {
    return {
      ctxInfo: {},
      contextKey: null
    }
  },
  computed: {
    jsonString() {
      return this.jsonToHTML(this.ctxInfo)
    }
  },
  methods: {
    toggleClicked() {
      this.clicked = !this.clicked
    },
    jsonToHTML(jsonObject) {
      let keys = Object.keys(jsonObject)
      let html = keys.map(key => {
        // debugger
        return this.handleKey(key, jsonObject)
      })
      return  html.join(' ')
    },
    handleKey(key, jsonObject) {
      if (typeof jsonObject[`${key}`] !== 'object') {
        // debugger
        return `<div><span>${key}:</span><span>${jsonObject[`${key}`]}</span></div>`
      }
      else {
        // debugger
        return this.jsonToHTML(jsonObject[`${key}`])
      }
    }
  },
  created() {
    this.contextKey = this.subscribe(this.contextName, (context, delta, removed) => {
      // debugger
      this.ctxInfo = context;
    console.log("info", this.contextName)
    console.log("info", this.ctxInfo)
    });
  }
}
</script>

<style>
  .context-detail {
  display:flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
}
</style>

