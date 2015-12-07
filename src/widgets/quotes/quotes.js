(function(){
	'use strict';

	angular.module('app')
		.config(Config)
		.controller('QuotesCtrl', QuotesCtrl)

	function Config(WidgetsProvider)
	{
		WidgetsProvider.register('quotes', {
			title: 'Quotes',
			template: 'quotes.html',
			storage: {
				items: [] 
			}
		})
	}

	function QuotesCtrl($scope, $localStorage, $http, $q)
	{

		$scope.quote = getRandom($localStorage.quotes.items);

		load(['http://feeds.feedburner.com/theysaidso/qod/inspire']);

		function load(resources)
		{

			var baseUrl = 'https://ajax.googleapis.com/ajax/services/feed/load?callback=JSON_CALLBACK&v=2.0&q=';	
			var old = sessionStorage.getItem('quotesLastRequest')  <= Date.now() - (24*60*60*1000);

			resources = angular.copy(resources);

			if ( old || !$localStorage.quotes.items.length)
				$q.all(resources.map(getQuotes)).then(function(quotes){
					sessionStorage.setItem('quotesLastRequest', Date.now());
					$localStorage.quotes.items = $localStorage.quotes.items.concat(quotes).unique().splice(-10);
					$scope.quote = getRandom($localStorage.quotes.items);
				});

			function getQuotes(url, key, collection)
			{
				return $http.jsonp(baseUrl + url).then(function(response){
					// TODO: notify user (if nothing was found, error...)
					var quote = response.data.responseData.feed.entries[0];
					return {
						contentSnippet: quote.contentSnippet,
						author: quote.author,
						link: quote.link
					};
				});
			}

		}

		function getRandom(array)
		{
			return array[Math.floor(Math.random() * array.length)];
		}

		function normalizeURL(url)
		{
			url = url.substr(-1) === '/' ? url.substr(0, url.length - 1) : url;
			return !/^(?:f|ht)tps?\:\/\//.test(url) ? 'http://' + url : url;
		}

		Array.prototype.unique = function()
		{
			var u = {},	a = [];
			for (var i = 0, l = this.length; i < l; ++i) {
				if (u.hasOwnProperty(this[i])) {
					continue;
				}
				a.push(this[i]);
				u[this[i]] = 1;
			}
			return a;
		}


	}

})();