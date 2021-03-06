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
      this.settings = config.settings;

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
      controller: controller,
      controllerAs: 'Widget',
      link: link
    };

    function link($scope, iElm, iAttrs)
    {
      var widget = $scope.widget = _.findWhere(Widgets, {type: normalize(iAttrs.type)});
      if (widget && widget.controller)
        $controller(widget.controller, {$scope: $scope});

      $scope.isSettingOpen = false;
    }

    function controller()
    {

      this.openSettings = openSettings;

      ////////////////////////////////

      function openSettings()
      {
        console.log('foi');
      }

    }
  }

  function normalize(string)
  {
    return string;
  }

})();
