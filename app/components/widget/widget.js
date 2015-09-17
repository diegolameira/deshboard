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
      this.nav = config.nav;

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
      $scope.niceOptions = {
        cursorborder:'none',
        cursorcolor: 'rgba(255,255,255,1)',
        cursorborderradius: '0'
      };
    }

    function controller($scope)
    {

      this.action = action;
      this.toggleSettings = toggleSettings;

      ////////////////////////////////

      function toggleSettings()
      {
        $scope.isSettingOpen = !$scope.isSettingOpen;
      }

      function action(action)
      {
        $scope[action]();
      }

    }
  }

  function normalize(string)
  {
    return string;
  }

})();
