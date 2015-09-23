(function(){
  "use strict";

  angular.module('widgets')
    .config(Config)
    .controller('FavoritesController', Controller)

  ;////////////////////////

  function Config(WidgetsProvider)
  {

    WidgetsProvider.register('favorites', {
      title: 'Favorites',
      template: 'components/favs/favs.html',
      controller: 'FavoritesController',
      settings: 'components/favs/settings.html'
    });

  }

  function Controller($scope, _, $localStorage)
  {

    var defaults = [{
      title: 'Google',
      link: 'http://google.com'
    }];

    $scope.$storage = $localStorage.$default({
      favorites: defaults
    });

    $scope.favorites = [];

    $scope.addSource = addSource;
    $scope.removeSource = removeSource;

    $scope.$watchCollection('$storage', init);

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
