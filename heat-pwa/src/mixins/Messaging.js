var myMixin = {
  created: function () {},
  methods: {
    // Subscribe to the named event passed in
    subscribe: function (name, subscriber) {
      if (name === undefined) return
      window.glue.contexts.subscribe(name, (context, delta, removed) => {
        if (subscriber !== undefined) {
          subscriber(context, delta, removed)
        }
      })
    },
  }
};

export default myMixin;