(function(){
  "use strict";

  angular.module('ui', ['angular-carousel'])
    .directive('carousel', CarouselDirective)

  ;//////////////////////

  function CarouselDirective()
  {
    return {
      scope: {
        collection: '='
      },
      link: link
    };

    function link($scope, iElm)
    {

      iElm.css('display', 'none');
      var slicked = false;
      var update = _.debounce(function(){
        $scope.$$postDigest(function update(){
          if ( slicked )
            iElm.slick('unslick');
          else{
            slicked = true;
            iElm.css('display', 'block');
          }
          iElm.slick({
            slide: '.carousel-item',
            dots: true,
            arrows: true,
            autoplay: true,
            infinite: false,
            slidesToShow: 1,
            slidesToScroll: 1,
          });
        });
      }, 1000);

      $scope.$watchCollection('collection', update);

    }
  }

})();
