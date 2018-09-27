<template>
  <li class="context-li">
    <button @click="toggleClicked">X</button>
    <span>{{contextName}}</span>
    <context-detail v-if="clicked" :contextName="contextName"></context-detail>
  </li>
</template>
<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
import { StyleTogglerMixin } from 'jscatalyst';
import contextDetail from '@/components/CtxDetail.vue'
import Messaging from '@/mixins/Messaging';
import Windowing from '@/mixins/Windowing';

export default {
  name: 'ContextItem',
  mixins: [Messaging, Windowing, StyleTogglerMixin],
  props: ['contextName'],
  components: {
    contextDetail: contextDetail
  },
  data() {
    return {
      clicked: false
    }
  },
  computed: {
    parseContext() {
      return this.jsonToHTML(this.context)
      },
    test() {
      return JSON.stringify(this.context)
    }
  },
  methods: {
    toggleClicked() {
      this.clicked = !this.clicked
    }
  }
}
</script>
<style>

.context-li {
  display:flex;
  align-items: flex-start;
  justify-content: space-between;
}
</style>
