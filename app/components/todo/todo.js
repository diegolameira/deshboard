(function(){
  "use strict";

  angular.module('widgets')
    .config(Config)
    .factory('TodoFactory', TodoFactory)
    .factory('TodoHistory', TodoHistory)
    .controller('TodoController', Controller)

  ;////////////////////////

  function TodoFactory()
  {

    function TODO(todo){

      if ( _.isString(todo) )
        todo = {title: todo};

      this.title = todo.title;
      this.completed = todo.completed || false;
      this.nodes = todo.nodes || [];
      this.created = todo.created || Date.now();

    }

    TODO.prototype.complete = complete;
    TODO.prototype.uncomplete = uncomplete;

    return TODO;

    ///////////////////

    function complete()
    {
      this.completed = true;
      if (this.nodes && this.nodes.length)
        this.nodes.map(function(node){
          return complete.call(node);
        });
      return this;
    }

    function uncomplete()
    {
      this.completed = false;
      if (this.nodes && this.nodes.length)
        this.nodes.map(function(node){
          return uncomplete.call(node)
        });
      return this;
    }

  }

  function TodoHistory()
  {
    return function(obj){

      var history = [];

      history.save = save;
      history.back = back;

      ////////////

      function save(){
        //history.push(JSON.stringify(obj));
      }

      function back(){
       //return JSON.parse(history.pop());
      }

      return history;

    };

  }

  function Config(WidgetsProvider, $localStorageDefaultsProvider)
  {

    $localStorageDefaultsProvider.set('todo', []);

    WidgetsProvider.register('todo', {
      title: 'Todo',
      template: 'components/todo/todo.html',
      controller: 'TodoController',
      nav: {
        options: [{
          ico: 'undo',
          label: 'Undo',
          action: 'undo',
          hide: '!history.length'
        }, {
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

  function Controller($scope, TodoFactory, TodoHistory)
  {

    $scope.temp = {
      input: ''
    };

    var history = $scope.history = new TodoHistory($scope.$storage, 'todo');

    $scope.editing = null;

    $scope.add = add;
    //$scope.remove = remove;
    $scope.clean = clean;
    $scope.markAll = markAll;
    $scope.checkChildren = checkChildren;

    $scope.startEditing = startEditing;
    $scope.stopEditing = stopEditing;

    $scope.undo = undo;

    $scope.remove = function (scope) {
      history.save();
      scope.remove();
    };

    $scope.toggle = function (scope) {
      scope.toggle();
    };

    $scope.newSubItem = function (scope) {
      history.save();
      scope.expand();
      var nodeData = scope.$modelValue;

      // Legacy
      if ( !nodeData.nodes )
        nodeData.nodes = [];

      var newNode = new TodoFactory(nodeData.title + '.' + (nodeData.nodes.length + 1) );
      nodeData.nodes.push(newNode);
      startEditing(newNode);
    };

    $scope.collapseAll = function () {
      $scope.$broadcast('collapseAll');
    };

    $scope.expandAll = function () {
      $scope.$broadcast('expandAll');
    };

    //////////////////////////////

    function undo()
    {
      history.back();
    }

    function startEditing(node){
      history.save();
      $scope.editing=node;
      $scope.$$postDigest(function(){
        $('[ui-tree-handle] .editing').focus();
      });
    }

    function stopEditing(){
      $scope.editing=null;
    }

    function add(string)
    {
      history.save();
      if (_.isEmpty(string))
        return false;
      $scope.$storage.todo.push(new TodoFactory(string));
      $scope.temp.input = '';
    }

    function clean()
    {
      history.save();
      $scope.$storage.todo = _.reject($scope.$storage.todo, {completed: true});
    }

    function markAll()
    {
      history.save();
      $scope.$storage.todo.map(function(todo){
        return complete.call(todo);
      });
    }

    function checkChildren(node)
    {
      history.save();
      if ( node.completed )
        node.nodes.map(function(todo){
          return complete.call(todo);
        });
      else
        node.nodes.map(function(todo){
          return uncomplete.call(todo);
        });
    }

    function complete()
    {
      this.completed = true;
      if (this.nodes && this.nodes.length)
        this.nodes.map(function(node){
          return complete.call(node);
        });
      return this;
    }

    function uncomplete()
    {
      this.completed = false;
      if (this.nodes && this.nodes.length)
        this.nodes.map(function(node){
          return uncomplete.call(node)
        });
      return this;
    }


  }

})();
