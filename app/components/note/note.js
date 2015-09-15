(function(){
  "use strict";

  angular.module('widgets')
    .config(Config)
    .controller('NoteController', Controller)

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

})();
