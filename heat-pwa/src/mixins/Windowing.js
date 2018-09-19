var WindowingMixin = {
  created: function () {},
  methods: {
    openContextWindow: function(title, url, filter) {
      alert(filter)
      const localWindow = window.glue.windows.my();

      window.glue.windows.open(title, url, {
        relativeTo: localWindow.id,
        realtivePosition: 'left',
        context: {
          filter: filter
        }
      })
    },

    enableOptions: function () {
      var searchIcon = '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';
      const myWindow = window.glue.windows.my();
  
      if ( myWindow === undefined )
        alert ('no window yet')
  
      myWindow.addFrameButton({
          buttonId: 'search-button',
          tooltip: 'Search',
          order: 1,
          imageBase64: searchIcon // needs to be a valid base64-encoded image
      },
      (w) => console.log('created button'),
      console.error);
  
      // We can launch new windows from URL's
      myWindow.onFrameButtonClicked(function (buttonInfo) {
      if (buttonInfo.buttonId === 'search-button') {
        let app = window.glue.appManager.application('JSCUserSettings');
        const localWindow = window.glue.windows.my();
        let windowConfig = {
        };

        // Launch the app and then wait for the return so that we can grab the instance Id
        app
          .start({}, windowConfig)
          .then(instance => {
            console.log(instance)
            //localThis.gridInstance = instance
          })
          .catch( exception => {
            console.log(exception)
          });
      }
    });
  
    },
  }
}

export default WindowingMixin