import Vue from 'vue'

var plugin = {
    install(Vue, options) {
        
        Vue.mixin({
            methods: {
                // from Messaging mixin 
                // Subscribe to the named event passed in
                subscribe: function(name, subscriber) {
                    if ( name === undefined ) return
                    
                    window.glue.contexts.subscribe(name, (context, delta, removed) => {
                      if ( subscriber !== undefined ) {
                        subscriber(context, delta, removed)
                      }
                    })
                },
                // from App.vue
                initializeTheme(){
                    this.subscribe('globalTheme', (context, delta, removed) => {
                        console.log("global theme context", context)
                        this.setColor(context.color)
                        this.setLighting(context.lighting)
                      })
                },
                // from App.vue
                initializeGlueContext(){
                    const localWindow = window.glue.windows.my();
                    const ctx = localWindow.context;
                    const contextName = ctx.contextName;
                        //this is the grid specific local context it opens with
                
                    if (contextName !== undefined) {
                        this.$store.commit('setBelongsToGrid'); //disables socket refresh
                        this.$store.commit('setSelected', contextName)
                        this.subscribe(contextName, (context, delta, removed) => {
                        this.$store.commit('initializeData', context.filter.data);
                        });
                    }
                    if (ctx.filter) {
                        this.$store.commit('initializeData', ctx.filter.data);
                    } else {
                        this.$store.dispatch('fetchData');
                    }
                }

            }

        })


    }
}

export default plugin