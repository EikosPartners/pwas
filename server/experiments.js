// window 1

// post to Socket.Io name of chart/pwa you want
// socket.io returns URL, windowName, socket namespace (i.e. context) 

let urlWithContext = url + '?' + namespace
childWindow = window.open(urlWithContext, windowName, "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes,toolbar=yes")

// childWindow.postMessage(context, URL)
// needs to wait until content loaded in window 2

// window 2 
// index.html

window.onload=function(){
    if (window.location.href.includes("?")) {
      window.context = window.location.href.split('?')[1]
      history.pushState(window.location.href, null, (window.location.href.split('?')[0]))
    }
  }

// use context to tell websocket context/namespace "I'm awake send me data"
// websocket sends the filtered data that is relevant 
// render a useful chart 


  