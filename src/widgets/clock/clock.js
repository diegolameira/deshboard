(function(){
	'use strict';

	angular.module('app')
		.config(Config)
		.controller('ClockCtrl', ClockCtrl)

	function Config(WidgetsProvider)
	{
		WidgetsProvider.register('clock', {
			title: 'Clock',
			template: 'clock.html'
		})
	}

	function ClockCtrl($interval)
	{
		var monthNames = [
			"January", "February", "March",
			"April", "May", "June", "July",
			"August", "September", "October",
			"November", "December"
		];

		var _this = this;
		this.date = '';
		this.time = '';

		update();
		$interval(update, 1000);

		function update()
		{
			var date = new Date();

			var day = date.getDate();
			var monthIndex = date.getMonth();
			var year = date.getFullYear();

			var hours = ('0' + date.getHours()).slice(-2);
			var mins = ('0' + date.getMinutes()).slice(-2);
			var secs =  ('0' + date.getSeconds()).slice(-2);

			_this.time = hours + ':' + mins + ':' + secs;
			_this.date = monthNames[monthIndex] + ' ' + day + ', ' + + year;

		}
	}

})();