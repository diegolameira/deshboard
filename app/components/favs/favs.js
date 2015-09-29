(function(){
  "use strict";

  angular.module('widgets')
    .config(Config)
    .controller('FavoritesController', Controller)

  ;////////////////////////

  function Config(WidgetsProvider, $localStorageDefaultsProvider)
  {

    $localStorageDefaultsProvider.set('favorites', [{
      title: 'Google',
      link: 'http://google.com'
    }]);

    WidgetsProvider.register('favorites', {
      title: 'Favorites',
      ico: 'star',
      template: 'components/favs/favs.html',
      controller: 'FavoritesController',
      settings: 'components/favs/settings.html'
    });

  }

  function Controller($scope, $rootScope, _)
  {

    $scope.favorites = [];

    $scope.addSource = addSource;
    $scope.removeSource = removeSource;

    $rootScope.$watchCollection('$storage', init);

    ////////////////////////////////

    function init(storage)
    {
      $scope.favorites = _.clone(storage.favorites);
    }

    function addSource()
    {
      $scope.$storage.favorites.push({name:'', url: ''});
    }

    function removeSource(index)
    {
      if (~index)
        $scope.$storage.favorites.splice(index, 1);
    }

  }

})();
