(function(document, window, angular, undefined){
	'use strict';

	var Paths = {
		components: 'widgets'
	};

	angular.module('app', ['ngStorage'])
		.provider('Widgets', Widgets)
		.directive('widget', WidgetDirective)
		.controller('MainCtrl', MainController)
		.constant('Paths', Paths)

	function Widgets(Paths)
	{
		
		var widgets = [];

		var Widget = function(name, data)
		{
			this.name = name;
			this.title = data.title;
			this.templateUrl = Paths.components + '/' + this.name + '/' + ( data.template || 'index.html' );
			this.storage = data.storage;
		}

		return {
			register: function(title, data)
			{
				widgets.push(new Widget(title, data));
			},
			$get: function()
			{
				return widgets;
			}
		}
	}

	function WidgetDirective($controller)
	{
		return {
			restrict: 'EA',
			scope: {
				widget: '='
			},
			controller: controller,
			compile: function()
			{
				return {
					pre: preLink,
					post: postLink
				};
			}
		};

		function controller()
		{}

		function preLink(scope, element, attrs) 
		{
		}
		
		function postLink(scope, element, attrs) 
		{
		}

	}

	function MainController($scope, $localStorage,  Widgets)
	{

		var storageExtension = (function(Widgets){
			
			var extension = {};
			Widgets.forEach(function(widget){
				extension[widget.name] = widget.storage;
			});

			return extension;

		})(Widgets);

		var defaultStorage = {};

		angular.extend(defaultStorage, {
			theme: 'theme-dark',
			blocks: Widgets
		}, storageExtension);

		$scope.$storage = $localStorage.$default(defaultStorage);

		// dev only
		$scope.$storage.blocks = Widgets;

		$scope.googleit = function(term)
		{
			return 'http://google.com/search?q=' + encodeURIComponent(term);
		}

	}

})(document, window, angular);