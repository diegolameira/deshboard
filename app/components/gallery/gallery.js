(function(){
  "use strict";

  angular.module('widgets')
    .config(Config)
    .controller('GalleryController', Controller)

  ;////////////////////////

  function Config(WidgetsProvider)
  {

    WidgetsProvider.register('gallery', {
      title: 'Gallery',
      template: 'components/gallery/gallery.html',
      controller: 'GalleryController'
    });

  }

  function Controller($scope, $http)
  {

    $scope.images = [];

    var baseUrl = 'http://www.bing.com/';
    var apiUrl = baseUrl + 'HPImageArchive.aspx?callback=JSON_CALLBACK&format=js&idx=0&n=5&mkt=en-US';

    $http.jsonp(apiUrl)
      .then(function(response){
        $scope.images = _.map(response.data.images, function(image){
          image.url = baseUrl + image.url;
          return image;
        });
      });

  }

})();
