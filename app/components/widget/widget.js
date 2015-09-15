(function(){
  "use strict";

  angular.module('widgets', [])
    .provider('Widgets', Provider)
    .directive('widget', Skeleton)

  ;////////////////////////////

  function Provider()
  {

    var widgets = [];
    var Widget = function(name, config)
    {

      this.type = normalize(name);
      this.name = name;
      this.title = config.title;
      this.template = config.template;
      this.controller = config.controller;

    };

    return {
      register: register,
      $get: list
    };

    /////////////////

    function register(name, config)
    {
      widgets.push(new Widget(name, config));
    }

    function list()
    {
      return widgets;
    }

  }

  function Skeleton($controller, Widgets)
  {
    return {
      scope: {},
      replace: true,
      templateUrl: 'components/widget/skeleton.html',
      link: link
    };

    function link($scope, iElm, iAttrs)
    {
      var widget = $scope.widget = _.findWhere(Widgets, {type: normalize(iAttrs.type)});
      if (widget && widget.controller)
        $controller(widget.controller, {$scope: $scope});
    }
  }

  function normalize(string)
  {
    return string;
  }

})();
