(function(){
	'use strict';

	angular.module('app')
		.config(Config)
		.controller('FeedsCtrl', FeedsCtrl)

	function Config(WidgetsProvider)
	{
		WidgetsProvider.register('feeds', {
			title: 'Feeds',
			template: 'feeds.html',
			storage: {
				items: []
			}
		})
	}

	function FeedsCtrl($scope, $localStorage, $http)
	{

		var feeds = $scope.feeds = $localStorage.feeds.items;
		$scope.readableFeeds = [];

		this.current = '';

		this.add = add;
		this.remove = remove;

		$scope.$watchCollection('feeds', init);

		function init(feeds)
		{

			feeds = angular.copy(feeds);
			feeds.map(getFeed);
			$scope.readableFeeds = feeds;

			function getFeed(url, key, collection)
			{
				var baseUrl = 'https://ajax.googleapis.com/ajax/services/feed/load?callback=JSON_CALLBACK&v=2.0&q=';
				$http.jsonp(baseUrl + url).then(function(response){
					collection[key] = response.data.responseData.feed;
				});
			}
		}

		function add(feedUrl)
		{
			feeds.unshift(normalizeURL(feedUrl));
			this.current = '';
		}

		function remove(feedUrl)
		{
			feeds.splice(feeds.indexOf(feedUrl), 1);
		}

		function normalizeURL(url)
		{
			return !/^(?:f|ht)tps?\:\/\//.test(url) ? 'http://' + url : url;
		}

	}

})();