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

	function TodoCtrl($scope, $localStorage, Tree)
	{

		var Todo = function(todo)
		{

			if ( typeof todo == 'string' )
				todo = {title: todo};

			todo = angular.extend({
				completed: false,
				created: Date.now()
			}, todo);

			return {
				id: guid(),
				title : todo.title,
				completed :  todo.completed,
				created : todo.created
			}

		};

		this.current = '';

		this.add = add;
		this.insert = insert;
		this.remove = remove;
		this.getCreatedDate = getCreatedDate;

		this.checkChildren = checkChildren;

		var tree = new Tree('todos');

		$scope.todos = tree._root;
		$scope.tree = tree;

		$scope.$watchCollection('todos', function(todos){
			angular.extend($localStorage.todo.todos, angular.copy(todos));
		});

		function guid()
		{
			function s4() {
				return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
			}
			return s4() + '-' + s4() + '-' + s4();
		}

		function todoFactory(todo)
		{
			
			if ( Object.prototype.toString.call( todo ) === '[object Array]' )
				return [].concat(todo.map(todoFactory));

			if (todo.todos)
				todo.todos.map(todoFactory);

			return new Todo(todo);

		}

		function add(todo)
		{
			todo = new Todo(todo);
			this.current = '';
			return tree.add(todo, tree._root.data, tree.traverseBF);
		}

		function insert(parent, todo)
		{
			todo = new Todo(todo || '');
			return tree.add(todo, parent.data, tree.traverseDF);
		}

		function remove(node, parent)
		{
			return tree.remove(node.data, node.parent.data, tree.traverseBF);
		}

		function getCreatedDate(todo)
		{
			return new Date(todo.created).toString();
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