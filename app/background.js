(function(){
  "use strict";

  chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create('app/index.html', {
      'outerBounds': {
        'width': 1024,
        'height': 768
      }
    });
  });


})();
