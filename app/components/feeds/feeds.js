(function(){
  "use strict";

  angular.module('widgets')
    .config(Config)
    .controller('FeedsController', Controller)

  ;////////////////////////

  function Config(WidgetsProvider)
  {

    WidgetsProvider.register('feeds', {
      title: 'Feeds',
      template: 'components/feeds/feeds.html',
      controller: 'FeedsController'
    });

  }

  function Controller($scope, _, $http, $localStorage)
  {

    var defaults = [
      'http://alistapart.com/site/rss',
      'http://www.smashingmagazine.com/feed/',
      'http://g1.globo.com/dynamo/mundo/rss2.xml',
      'http://g1.globo.com/dynamo/economia/rss2.xml',
      'http://g1.globo.com/dynamo/tecnologia/rss2.xml',
      'http://g1.globo.com/dynamo/rio-de-janeiro/rss2.xml'
    ];

    $scope.$storage = $localStorage.$default({
      feeds: defaults
    });

    $scope.feeds = [];

    $scope.$watchCollection('$storage', init);

    function init(storage)
    {
      $scope.feeds = _.clone(storage.feeds);
      $scope.feeds.map(getFeed);
    }

    function getFeed(url, key, collection)
    {
      var baseUrl = 'https://ajax.googleapis.com/ajax/services/feed/load?callback=JSON_CALLBACK&v=2.0&q=';
      $http.jsonp(baseUrl + url).then(function(response){
        collection[key] = response.data.responseData.feed;
      });
    }

  }

})();
