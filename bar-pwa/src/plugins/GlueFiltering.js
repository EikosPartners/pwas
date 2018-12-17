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
               

                filter(filterPkg) {
                    console.log("Filter", filterPkg)
                    let {clickEvent, filterObj, contextID} = filterPkg
                    if(this.handleShiftClick(clickEvent)){
                      // Case: Shift Click
                      this.gridInstance = false
                      this.manageContextWindow(filterObj, "StandAloneGrid") // Filtering Mixin
                    }else{
                    // Case: Default Click (no 'Shift')
                      const context = this.handleFilterOnGrid(contextID)
                      this.applyFilterToContext(filterObj, context); 
                      this.manageContextWindow(filterObj, context)  
                      return context
                    }
              
                  },
            
                  // Apply Filter to provided context ID
                  // Formerly the filter() function in legacy messaging mixin
                applyFilterToContext(filter, contextID){
                    if (window.glue != undefined) {
                        console.log('GLUE42: Filtering plugin message ', filter, contextID);
                        if (contextID !== undefined) {
                        window.glue.contexts.set(contextID, filter);
                        } else {
                        window.glue.contexts.set('filter', filter);
                        }
                    } else {
                        console.log('WEBSockets: Filtering message ', filter);
                        this.$socket.emit('filterByDate', filter);
                    }
                },

                handleShiftClick(click){
                    console.log(click.shiftKey)
                    if (click.shiftKey){
                        return true
                    }
                    return false
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
                    console.log("initialize glue contexts")
                },
            
                handleFilterOnGrid(contextID){
                    if(this.verifyNewContextID(contextID)){
                        const uniqueID = Date.now()
                        const newContext = 'filterOnGrid' + uniqueID
                        return newContext
                        // this.setFilterOnGridID(newContext)
                    }
                    return contextID
                },
          
               
                verifyNewContextID(contextID){
                    if(contextID === null){
                      return true
                    }
                    let context = contextID
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
                      let app = window.glue.appManager.application('JSCDataGrid');
                      const localWindow = window.glue.windows.my();
                      let windowConfig = {
                        relativeTo: localWindow.id,
                        relativePosition: 'right'
                      };
                      app
                        .start({ filter, eventName }, windowConfig)
                        .then(instance => {
                          //localThis.gridInstance = instance
                          
                        });
                      
                      this.gridInstance = true;
                    }
                },

                handleStandAloneGrid(contextFilter){
                    this.manageContextWindow(contextFilter, "StandAloneGrid")
                },

                initializeTheme(){
                    this.subscribe('globalTheme', (context, delta, removed) => {
                        console.log("global theme context", context)
                        this.setColor(context.color)
                        this.setLighting(context.lighting)
                    })
                },
            }
        })
    }
}

export default plugin