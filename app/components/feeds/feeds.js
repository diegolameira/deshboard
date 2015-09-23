(function(){
  "use strict";

  angular.module('widgets')
    .config(Config)
    .controller('FeedsController', Controller)

  ;////////////////////////

  function Config(WidgetsProvider, $localStorageDefaultsProvider)
  {

    $localStorageDefaultsProvider.set('feeds', [
      'http://alistapart.com/site/rss',
      'http://www.smashingmagazine.com/feed/',
      'http://g1.globo.com/dynamo/mundo/rss2.xml',
      'http://g1.globo.com/dynamo/economia/rss2.xml',
      'http://g1.globo.com/dynamo/tecnologia/rss2.xml',
      'http://g1.globo.com/dynamo/rio-de-janeiro/rss2.xml'
    ]);

    WidgetsProvider.register('feeds', {
      title: 'Feeds',
      template: 'components/feeds/feeds.html',
      controller: 'FeedsController',
      settings: 'components/feeds/settings.html'
    });

  }

  function Controller($scope, $rootScope, _, $http)
  {

    $scope.feeds = [];

    $scope.addSource = addSource;
    $scope.removeSource = removeSource;

    $rootScope.$watchCollection('$storage', init);

    ////////////////////////////////

    function init(storage)
    {
      var feeds = $scope.feeds = _.clone(storage.feeds);
      if ( feeds )
        feeds.map(getFeed);
    }

    function getFeed(url, key, collection)
    {
      if (_.isEmpty(url))
        return false;
      var baseUrl = 'https://ajax.googleapis.com/ajax/services/feed/load?callback=JSON_CALLBACK&v=2.0&q=';
      $http.jsonp(baseUrl + url).then(function(response){
        collection[key] = response.data.responseData.feed;
      });
    }

    function addSource()
    {
      $scope.$storage.feeds.push('');
    }

    function removeSource(index)
    {
      if (~index)
        $scope.$storage.feeds.splice(index, 1);
    }

  }

})();
