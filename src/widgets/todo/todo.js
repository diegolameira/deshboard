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
				completed: false,
				created: Date.now()
			}, todo);

			this.title = todo.title;
			this.completed =  todo.completed;
			this.created = todo.created;
		};

		Todo.prototype.getCreatedDate = function()
		{
			return new Date(this.created).toString();
		}

		Todo.prototype.siblings = function()
		{
			return $scope.todos;
		}

		this.current = '';

		this.add = add;
		this.insert = insert;
		this.remove = remove;

		this.checkChildren = checkChildren;

		$scope.todos = $localStorage.todo.todos;

		function add(todo)
		{
			$scope.todos.unshift(new Todo(todo));
			this.current = '';
		}

		function insert(todo)
		{
			var newTodo = new Todo();
			todo.todos = todo.todos || [];
			todo.todos.unshift(newTodo);
			newTodo.siblings = function()
			{
				return todo.todos;
			}
		}

		function remove(todo)
		{
			(todo.siblings() || todos).splice(todos.indexOf(todo), 1);
		}

		function checkChildren(todo)
		{
			if ( !!todo.completed )
				complete(todo)
			else
				uncomplete(todo);

			function complete(todo)
			{
				todo.completed = true;
				if (todo.todos)
					todo.todos.forEach(complete);
			}

			function uncomplete(todo)
			{
				todo.completed = false;
				if (todo.todos)
					todo.todos.forEach(uncomplete);
			}
		}

	}

})();