(function(){
  "use strict";

  angular.module('auth', ['firebase'])
    //.config(Config)
    .run(Run)
    .provider('Auth', Auth)
    //.controller('Login', Controller)

  ;////////////////////////

  function Run(Auth, Keypress, $firebaseAuth)
  {

    var ref = new Firebase('https://FIREBASEDOMAIN.firebaseio.com'.replace('FIREBASEDOMAIN', Auth.firebaseKey));

    // create an instance of the authentication service
    var auth = $firebaseAuth(ref);

    var listener = new Keypress.Listener();

    // Block save
    listener.simple_combo('meta u', function(ev) {
      ev.preventDefault();

      auth.$authWithOAuthPopup('facebook').then(function(authData) {
        console.log("Logged in as:", authData);
      }).catch(function(error) {
        console.log("Authentication failed:", error);
      });

      return;
    });

  }

  function Auth()
  {
    var firebaseKey = 'chromedevboard';

    return {
      $get: Service,
      firebaseKey: firebaseKey
    };

    function Service()
    {
      this.firebaseKey = firebaseKey;

      return this;

    }
  }

  function Controller($scope, $firebaseAuth, Auth) {

    var ref = new Firebase('https://FIREBASEDOMAIN.firebaseio.com'.replace('FIREBASEDOMAIN', Auth.firebaseKey));

    // create an instance of the authentication service
    var auth = $firebaseAuth(ref);

    $scope.oAuth = Auth.oAuth;

  }

})();
