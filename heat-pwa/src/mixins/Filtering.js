let FilterMixin = {
    methods: {
      filter(filterPkg) {
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
          console.log('GLUE42: Filtering message ', filter, contextID);
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
          if (click.shiftKey){
              return true
          }
          return false
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

      // Should we set a new FilterOnGridID? 
      // True => set FilterOnGridID
      // False => Do not
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
    }
}

export default FilterMixin