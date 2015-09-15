(function(){
  "use strict";

  angular.module('widgets')
    .config(Config)
    .controller('TodoController', Controller)

  ;////////////////////////

  function Config(WidgetsProvider)
  {

    WidgetsProvider.register('todo', {
      title: 'Todo',
      template: 'components/todo/todo.html',
      controller: 'TodoController'
    });

  }

  function Controller($scope, $localStorage)
  {

    $scope.$storage = $localStorage.$default({
      todo: []
    });

    $scope.add = function(string)
    {
      $scope.$storage.todo.push({title: string, completed: false, created: Date.now()});
    }

  }

})();
