(function(){
  "use strict";

  angular.module('ui', ['ngToast'])
    .directive('carousel', CarouselDirective)
    .service('UI', UI)

  ;//////////////////////

  function UI(ngToast)
  {

    return {
      toast: Toast,
    };

    function Toast(title, config)
    {
      // Default config
      config = _.merge({
        content: title,
      }, config);

      var toast = ngToast.create(config);

      return {
        dismiss: function(){
          ngToast.dismiss(toast);
        },
        dismissAll: function(){
          ngToast.dismiss();
        }
      }

    }

  }

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
