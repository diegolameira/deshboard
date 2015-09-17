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
      controller: 'TodoController',
      nav: {
        options: [{
          ico: 'check-square-o',
          label: 'Mark all as completed',
          action: 'markAll'
        }, {
          ico: 'trash',
          label: 'Clean all completed',
          action: 'clean'
        }]
      }
    });

  }

  function Controller($scope, $localStorage)
  {

    $scope.temp = {
      input: ''
    };
    $scope.$storage = $localStorage.$default({
      todo: []
    });

    $scope.add = add;
    $scope.remove = remove;
    $scope.clean = clean;
    $scope.markAll = markAll;

    function add(string)
    {
      if (_.isEmpty(string))
        return false;
      $scope.$storage.todo.push({title: string, completed: false, created: Date.now()});
      $scope.temp.input = '';
    }

    function remove(todo)
    {
      $scope.$storage.todo = _.without($scope.$storage.todo, todo);
    }

    function clean()
    {
      $scope.$storage.todo = _.reject($scope.$storage.todo, {completed: true});
    }

    function markAll()
    {
      $scope.$storage.todo.map(function(item){
        item.completed = true;
        return item;
      });
    }

  }

})();
