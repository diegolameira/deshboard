(function(){
  "use strict";

  angular.module('widgets')
    .config(Config)
    .controller('ClockController', Controller)

  ;////////////////////////

  function Config(WidgetsProvider)
  {

    WidgetsProvider.register('clock', {
      title: 'Clock',
      template: 'components/clock/clock.html',
      controller: 'ClockController'
    });

  }

  function Controller($scope, $interval, moment)
  {

    update();
    $interval(update, 1000);

    function update()
    {
      $scope.time = moment().format('HH:mm:ss');
      $scope.day = moment().format('LL');
    }

  }

})();
