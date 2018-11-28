let contextMixin = {

methods: {
    // Subscribe to the named event passed in
    subscribe: function (name, subscriber) {
      console.log("Subscribe")
      if (name === undefined) return
      window.glue.contexts.subscribe(name, (context, delta, removed) => {
        if (subscriber !== undefined) {
          subscriber(context, delta, removed)
        }
      })
    },
  }
}

export default contextMixin