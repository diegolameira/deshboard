(function(){
  "use strict";

  angular.module('widgets')
    .config(Config)
    .controller('QuoteController', Controller)

  ;////////////////////////

  function Config(WidgetsProvider)
  {

    WidgetsProvider.register('quote', {
      title: 'Quote',
      ico: 'quote-left',
      template: 'components/quote/quote.html',
      controller: 'QuoteController'
    });

  }

  function Controller($scope, $http)
  {

    var quote = $scope.quote = {
      quote: '',
      author: ''
    };

    var baseUrl = 'https://ajax.googleapis.com/ajax/services/feed/load?callback=JSON_CALLBACK&v=2.0&q=';
    var apiUrl = baseUrl + 'http://feeds.feedburner.com/theysaidso/qod/inspire';

    $http.jsonp(apiUrl)
      .then(function(response){
        var entry = response.data.responseData.feed.entries[0];
        // strip off author from snippet
        var index = _.lastIndexOf(entry.contentSnippet, '-');
        entry.contentSnippet = entry.contentSnippet.slice(0, index).trim();
        $.extend(true, quote, {quote: entry.contentSnippet, author: entry.author});
      });

  }

})();
