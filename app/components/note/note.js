(function(){
  "use strict";

  angular.module('widgets')
    .config(Config)
    .controller('NoteController', Controller)
    .directive('contenteditable', ContentEditableDirective)

  ;////////////////////////

  function Config(WidgetsProvider)
  {

    WidgetsProvider.register('note', {
      title: 'Note',
      template: 'components/note/note.html',
      controller: 'NoteController'
    });

  }

  function Controller($scope, $localStorage)
  {

    $scope.$storage = $localStorage.$default({
      note: ''
    });

  }

  function ContentEditableDirective(){
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, ctrl) {

        var delay = _.clone(scope.$eval(attrs.ngModelOptions)).debounce.default;
        var debounced = _.debounce(function(){
          ctrl.$setViewValue(element.html());
        }, delay || 200);

        // view -> model
        element.bind('blur', function() {
          scope.$apply(debounced);
        });

        element.bind('keyup', function(){
          scope.$apply(debounced);
        });

        // model -> view
        ctrl.$render = function() {
          element.html(ctrl.$viewValue);
        };

        ctrl.$render();

      }
    };
  }

})();
