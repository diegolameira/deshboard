/*eslint no-use-before-define: [2, "nofunc"]*/
(function(global, angular){
  'use strict';

  angular.module('app', ['ui', 'widgets', 'ngStorage', 'angular-nicescroll', 'ui.tree', 'chrome', angularDragula(angular)])
    .config(Config)
    .run(Run)
    .controller('WidgetsController', WidgetsController)
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

    $rootScope.$storage = $localStorage.$default(_.extend({}, $localStorageDefaults, {
      dashboards: [{
        title: 'Dashboard',
        layout: 0,
        widgets: [{
          type: 'todo',
          class: 'sunflower'
        }, {
          type: 'note',
          class: 'turquoise'
        }, {
          type: 'favorites',
          class: 'carrot'
        }, {
          type: 'clock',
          class: 'midnightblue'
        }, {
          type: 'quote',
          class: 'wisteria'
        }, {
          type: 'feeds',
          class: 'pomegranate'
        }]
      }]
    }));

    Sync.remote
      .fetch();

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

  function WidgetsController($rootScope, $scope, $compile, Widgets, dragulaService)
  {

    $scope.ui = {
      dashboards: $rootScope.$storage.dashboards
    };

    $scope.dashboardActive = $scope.ui.dashboards[0];

    $scope.settings = {
      layouts: [
        [{height:'100%'},{height:'60%'},{height:'40%'},{height:'25%'},{height:'35%'},{height:'40%'}],
        [{height:'33.3333%'},{height:'33.3333%'},{height:'33.3333%'},{height:'100%'},{height:'50%'},{height:'50%'}],
        [{height:'50%'},{height:'50%'},{height:'50%'},{height:'50%'},{height:'50%'},{height:'50%'}],
        [{height:'100%'},{height:'100%'},{height:'50%'},{height:'50%'},{height:'50%'},{height:'50%'}],
      ],
      colors: ['sunflower', 'turquoise', 'carrot', 'midnightblue', 'wisteria', 'pomegranate'],
      widgets: Widgets
    };

    $scope.$on('widgets.drop', drop);
    $scope.$on('widget.color.drop', drop);

    dragulaService.options($scope, 'widgets', {
      on: true,
      copy: true,
      moves: function (el, container, handle) {
        return !~handle.className.indexOf('dragular-ignore');
      }
    });

    //////////////////////////////


    function drop( ev, el, target, origin )
    {
      var tpl = '<widget type="{{w.type}}" class="{{w.class}}"></widget>';
      swap.call($scope.dashboardActive.widgets, origin.index(), target.index());
      $scope.$$postDigest(function(){
        target.html($compile(tpl)(target.scope()));
        origin.html($compile(tpl)(origin.scope()));
      })
    }

  }

  function swap(a, b){
    this[a] = this.splice(b, 1, this[a])[0];
  }

})(window, window.angular);
