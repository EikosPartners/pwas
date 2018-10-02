var myMixin = {
  methods: {
    handleDragStart(event) {
      //goes on the sender
      event.dataTransfer.setData("text/plain", this.contextId);
      console.log("dragstart", event);
    },
    handleDragEnd(event) {
      //goes on the sender
      console.log("dragend", event);
    },
    handleDragEnter(event) {
      //goes on the recieveer
      event.dataTransfer.dropEffect = "copy"
      event.preventDefault()
      return false
    },
    handleDragOver(event) {
      //goes on the reciever
      event.dataTransfer.dropEffect = "copy"
      event.preventDefault()
      return false
    },
    handleDrop(event) {
      //goes on the reciever
      var ctxName = event.dataTransfer.getData('text/plain')
      console.log('drop', ctxName)
      this.$store.commit('setSelected', `filteredGrid${ctxName}`)
      //THIS IS WHERE WE SHOULD SUBSCRIBE TO THE CONTEXT
      event.preventDefault()
    }
  }
};

export default myMixin