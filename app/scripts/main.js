/*eslint no-use-before-define: [2, "nofunc"]*/
(function(global, angular){
  'use strict';

  angular.module('app', ['ui', 'widgets', 'auth', 'ngStorage', 'angular-nicescroll', 'ui.tree', 'chrome'])
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

  function Run($rootScope, Keypress, Sync, $localStorage, $localStorageDefaults, _)
  {

    $rootScope.$storage = $localStorage.$default($localStorageDefaults);

    Sync.remote
      .fetch();
    //.get('todo')
    //.get('note')
    //.get('feeds')
    //.get('favorites');

    $rootScope.$watchCollection('$storage', function(data){
      var obj = _.chain(data)
        .pick(function(val, key){
          return !~key.indexOf('$');
        })
        .value();
      Sync.remote.set(obj);
    });

    var listener = new Keypress.Listener();

    // Block save
    listener.simple_combo('meta s', function(ev) {
      ev.preventDefault();
      return;
    });

  }

})(window, window.angular);
