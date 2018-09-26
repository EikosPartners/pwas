<template>
  <li v-html="parseContext"></li>
</template>
<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
import { StyleTogglerMixin } from 'jscatalyst';
import Messaging from '@/mixins/Messaging';
import Windowing from '@/mixins/Windowing';

export default {
  name: 'ContextItem',
  mixins: [Messaging, Windowing, StyleTogglerMixin],
  props: ['context'],
  computed: {
    parseContext() {
      return this.jsonToHTML(this.context)
      },
    test() {
      return JSON.stringify(this.context)
    }
  },
  methods: {
    jsonToHTML(jsonObject) {

      //this is halfway between handling a simple object and being made recusrive - I ran out of time :)
      let keys = Object.keys(jsonObject)
      let html = keys.forEach(key => {
        debugger
        if (typeof key !== 'Object') {
          return `<span>${key}:</span><span>${jsonObject[`${key}`]}</span>`
        } 
        else {
          return this.jsonToHTML(jsonObject[`${key}`])
        }
      })
      return html.join(' ')
    }
  }
}
</script>
<style>

</style>
