import Vue from 'vue'

let plugin = {
    install(Vue, options) {
        Vue.mixin({
            data(){
                return {
                    girdInstance: false
                }
            },
            methods:{
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
                filter: function(filter, name) {
                    console.log('GLUE42: Filtering message ', filter);
                    if ( name !== undefined ) {
                    window.glue.contexts.set(name, filter);
                    }
                    else {
                    window.glue.contexts.set('filter', filter);
                    }              
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
                },
                handleFilterOnGrid(data){
                    if(this.verifyNewContextID()){
                      const uniqueID = Date.now()
                      const contextID = 'filterOnGrid'+ uniqueID
                      this.setFilterOnGridID(contextID)
                    }
                },
                verifyNewContextID(){
                    if(this.filterOnGridID === null){
                      return true
                    }
                    let context = this.filterOnGridID
                    const windowsList = glue.windows.list()
                    let window = windowsList.find(w=>{
                      return w.context.eventName === context
                    })
                    if (window){
                      
                      return false
                    }
                    this.gridInstance = false
                    return true
                },
                manageContextWindow(filter, eventName){
        
                    if (this.gridInstance === true) {
                      // Can we pass the instance an updated context here?
                    } else {
                        if (window.glue) {
                            let app = window.glue.appManager.application('JSCDataGrid');
                            const localWindow = window.glue.windows.my();
                            const localThis = this;
                            let windowConfig = {
                            relativeTo: localWindow.id,
                            relativePosition: 'right'
                            };
                    
                            console.log(this.filterOnGridID)
                            
                            app
                            .start({ filter, eventName }, windowConfig)
                            .then(instance => {
                                //localThis.gridInstance = instance
                            
                            });
                            
                            this.gridInstance = true;
            
                        }
                    }
                },
                handleStandAloneGrid(contextFilter){
                    this.manageContextWindow(contextFilter, "StandAloneGrid")
                }
            }
        })
    }
}

export default plugin