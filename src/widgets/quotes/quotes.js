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
				items: [
					'http://feeds.feedburner.com/theysaidso/qod/inspire',
					// 'http://api.theysaidso.com/qod'
					]
			}
		})
	}

	function QuotesCtrl($scope, $localStorage, $http, $q)
	{

		$scope.quotes = [];
		$scope.quote = {};
		init($localStorage.quotes.items);

		function init(quotes)
		{

			var baseUrl = 'https://ajax.googleapis.com/ajax/services/feed/load?callback=JSON_CALLBACK&v=2.0&q=';	
			var old = sessionStorage.getItem('quotesLastRequest')  <= Date.now() - (24*60*60*1000);
			var cache = JSON.parse(sessionStorage.getItem('quotesCache')) || [];

			quotes = angular.copy(quotes);

			update(cache);

			if ( old || !cache.length)
				$q.all(quotes.map(getQuotes)).then(function(response){
					sessionStorage.setItem('quotesLastRequest', Date.now());
					cache = cache.concat(response).splice(-10)
					sessionStorage.setItem('quotesCache', JSON.stringify(cache));
					update(cache);
				});

			function update(quotes)
			{
				$scope.quotes = quotes;
				$scope.quote = quotes[Math.floor(Math.random() * quotes.length)];
			}

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

		function normalizeURL(url)
		{
			url = url.substr(-1) === '/' ? url.substr(0, url.length - 1) : url;
			return !/^(?:f|ht)tps?\:\/\//.test(url) ? 'http://' + url : url;
		}

	}

})();