/*eslint no-use-before-define: [2, "nofunc"]*/
(function(global, angular){
  'use strict';

  angular.module('app', ['ui', 'widgets', 'auth', 'ngStorage', 'angular-nicescroll', 'ui.tree'])
    .config(Config)
    .run(Run)
    .constant('moment', global.moment)
    .constant('_', global._)
    .constant('Keypress', global.keypress)

  ;/////////////////////////////////

  function Config($sceProvider)
  {
    $sceProvider.enabled(false);
  }

  function Run(Keypress)
  {
    var listener = new Keypress.Listener();

    // Block save
    listener.simple_combo('meta s', function(ev) {
      ev.preventDefault();
      return;
    });

  }

})(window, window.angular);
