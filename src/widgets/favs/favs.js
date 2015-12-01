(function(){
	'use strict';

	angular.module('app')
		.config(Config)
		.controller('FavsCtrl', FavsCtrl)

	function Config(WidgetsProvider)
	{
		WidgetsProvider.register('favs', {
			title: 'Favorites',
			template: 'favs.html',
			storage: {
				items: []
			}
		})
	}

	function FavsCtrl($scope, $localStorage, $http)
	{

		var favs = $scope.favs = $localStorage.favs.items;

		var Favorite = function(favorite)
		{
			var _this = this;

			if ( typeof favorite == 'string' )
				favorite = {url: favorite};

			favorite.url = normalizeURL(favorite.url);

			favorite = angular.extend({
				created: Date.now()
			}, favorite);

			getTitle(favorite.url).then(function(title){
				_this.title = _this.title || title;
			})

			getFavico(favorite.url).then(function(favico){
				_this.favico = _this.favico || favico;
				_this.favico = normalizeURL(_this.favico);
			})

			this.title = favorite.title;
			this.favico = favorite.favico;
			this.url = favorite.url;
			this.created = favorite.created;
		};

		this.current = '';

		this.add = add;
		this.remove = remove;

		function add(favorite)
		{
			favs.unshift(new Favorite(favorite));
			this.current = '';
		}

		function remove(todo)
		{
			favs.splice(favs.indexOf(todo), 1);
		}

		function getTitle(url)
		{
			return $http.get(url, {responseType: 'document'}).then(function(response){
				return response.data.title;
			});
		}

		function getFavico(url)
		{
			return $http.get(url, {responseType: 'document'}).then(function(response){
				var favicon = undefined;
				var nodeList = response.data.getElementsByTagName("link");
				for (var i = 0; i < nodeList.length; i++)
					if((nodeList[i].getAttribute("rel") == "icon")||(nodeList[i].getAttribute("rel") == "shortcut icon"))
						favicon = nodeList[i].getAttribute("href");
				if ( favicon && !~favicon.indexOf('//') )
					favicon = url + favicon;
				return favicon || url + '/favicon.ico';
			});
		}

		function normalizeURL(url)
		{
			return !/^(?:f|ht)tps?\:\/\//.test(url) ? 'http://' + url : url;
		}

	}

})();