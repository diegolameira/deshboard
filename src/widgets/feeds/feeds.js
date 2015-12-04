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

	function FeedsCtrl($scope, $localStorage, $http, $q)
	{

		var feeds = $scope.feeds = $localStorage.feeds.items;
		$scope.readableFeeds = [];

		this.current = '';

		this.add = add;
		this.remove = remove;

		$scope.$watchCollection('feeds', init);

		function init(feeds)
		{

			var baseUrl = 'https://ajax.googleapis.com/ajax/services/feed/load?callback=JSON_CALLBACK&v=2.0&q=';	
			var old = sessionStorage.getItem('rssLastRequest')  <= Date.now() - (1*60*60*1000);
			var cache = JSON.parse(sessionStorage.getItem('rssCache'));

			feeds = angular.copy(feeds);
			$scope.readableFeeds = cache;

			if ( old || !cache)
				$q.all(feeds.map(getFeed)).then(function(response){
					sessionStorage.setItem('rssLastRequest', Date.now());
					sessionStorage.setItem('rssCache', JSON.stringify(response));
					$scope.readableFeeds = response;
				});

			function getFeed(url, key, collection)
			{
				return $http.jsonp(baseUrl + url).then(function(response){
					// TODO: notify user (if nothing was found, error...)
					return response.data.responseData.feed;
				});
			}
		}

		function add(url)
		{
			var _this = this;
			
			url = normalizeURL(url);

			if (~url.indexOf('.xml'))
				return push(url);
			
			return $http.get(url, {responseType: 'document'}).then(function(response){
				var rss;
				var nodeList = response.data.getElementsByTagName("link");
				for (var i = 0; i < nodeList.length; i++)
					if((nodeList[i].getAttribute("rel") == "alternate")||(nodeList[i].getAttribute("type") == "'application/rss+xml'"))
						rss = nodeList[i].getAttribute("href");
				if ( rss && !~rss.indexOf('//') )
					rss = url + rss;
				return push(rss || url);
			});

			function push(url)
			{
				feeds.unshift(url);
				_this.current = '';
			}
			
		}

		function remove(feedUrl)
		{
			feeds.splice(feeds.indexOf(feedUrl), 1);
		}

		function normalizeURL(url)
		{
			url = url.substr(-1) === '/' ? url.substr(0, url.length - 1) : url;
			return !/^(?:f|ht)tps?\:\/\//.test(url) ? 'http://' + url : url;
		}

	}

})();