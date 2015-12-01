(function(){
	'use strict';

	angular.module('app')
		.config(Config)
		.controller('NoteCtrl', NoteCtrl)

	function Config(WidgetsProvider)
	{
		WidgetsProvider.register('note', {
			title: 'Note',
			template: 'note.html',
			storage: {
				text: ''
			}
		})
	}

	function NoteCtrl($scope, $localStorage)
	{
		$scope.note = $localStorage.note;
	}

})();