(function(){
	'use strict';

	angular.module('app')
	.config(Config)
	.controller('TodoCtrl', TodoCtrl)

	function Config(WidgetsProvider)
	{
		WidgetsProvider.register('todo', {
			title: 'Todo',
			template: 'todo.html',
			storage: {
				todos: []
			}
		})
	}

	function TodoCtrl($scope, $localStorage)
	{

		var Todo = function(todo)
		{

			if ( typeof todo == 'string' )
				todo = {title: todo};

			todo = angular.extend({
				completed: false
			}, todo);

			return {
				title : todo.title,
				completed :  todo.completed
			};

		};

		this.current = '';

		this.add = add;
		this.remove = remove;

		$scope.todos = $localStorage.todo.todos;

		function add(todo)
		{
			this.current = '';
			return $scope.todos.push(new Todo(todo));
		}

		function remove(todo)
		{
			var todos = $scope.todos;
			return todos.splice(todos.indexOf(todo), 1);
		}

	}

})();