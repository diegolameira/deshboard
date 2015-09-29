(function(){
  "use strict";

  angular.module('widgets')
    .config(Config)
    .controller('NoteController', Controller)
    .directive('contenteditable', ContentEditableDirective)

  ;////////////////////////

  function Config(WidgetsProvider, $localStorageDefaultsProvider)
  {

    $localStorageDefaultsProvider.set('note', '');

    WidgetsProvider.register('note', {
      title: 'Note',
      ico: 'pencil',
      template: 'components/note/note.html',
      controller: 'NoteController'
    });

  }

  function Controller($scope)
  {

  }

  function ContentEditableDirective(){
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, ctrl) {

        var options = _.clone(scope.$eval(attrs.ngModelOptions));
        var delay = _.has(options, 'debounce') ? options.debounce.default : 200;
        var debounced = _.debounce(function(){
          ctrl.$setViewValue(element.html());
        }, delay);

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
