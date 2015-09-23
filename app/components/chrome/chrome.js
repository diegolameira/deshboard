(function(global){
  'use strict';

  angular.module('chrome', ['ui'])
    .config(Run)
    .constant('chrome', global.chrome)
    .service('Sync', Sync)

  ;//////////////////////////////////

  var STORAGEKEY = 'ngStorage-';

  var storage = {
    set: function(key, value)
    {
      localStorage.setItem(key, _.isString(value) ? value : JSON.stringify(value));
    },
    get: function(key)
    {
      return JSON.parse(localStorage.getItem(key));
    }
  };

  function Run()
  {
    $('body').prepend('<toast>');
  }

  function Sync(chrome, UI)
  {

    var syncIcon = '<i class="fa fa-spin fa-circle-o-notch"></i>';
    var toast;

    var ChromeSync = function(s){
      return {

        set: function(data, callback){

          if ( toast )
            toast.dismiss();
          toast = UI.toast(syncIcon + ' syncing...');

          var obj = _.isObject(data) ? data : {};

          if ( _.isArray(data) )
          {
            _.each(data, function(){
              obj[data] = storage.get(STORAGEKEY+data);
            });
          }
          else if ( _.isString(data) )
          {
            obj[data] = storage.get(STORAGEKEY+data);
          }

          chrome.storage[s].set(obj, function(){

            toast.dismiss();

            var lastSync = Date.now();
            storage.set('lastSync', lastSync);
            chrome.storage[s].set({lastSync: lastSync}, angular.noop);

            if ( callback )
              callback();

          });

          return this;
        },

        get: function(key, callback){

          if ( toast )
            toast.dismiss();
          toast = UI.toast(syncIcon + ' syncing...');

          chrome.storage[s].get(key, function(data){

            toast.dismiss();

            if ( !_.isEmpty(data) )
              storage.set(STORAGEKEY+key, data[key]);

            if ( callback )
              callback();

          });

          return this;
        },
        fetch: function(callback){

          var self = this;

          if ( toast )
            toast.dismiss();
          toast = UI.toast(syncIcon + ' syncing...');
          var lastSync = {
            local: storage.get('lastSync')
          };

          chrome.storage[s].get(null, function(data){

            toast.dismiss();

            lastSync.remote = data['lastSync'];

            //  Sync Logic

            if ( !lastSync.local && lastSync.remote || lastSync.local < lastSync.remote )
            {
              _.each(_.omit(data, 'lastSync'), ReplaceLocal);
              storage.set('lastSync', data.lastSync);
              UI.toast('<i class="fa fa-check"></i> Data synced');
            } else {
              ReplaceRemote();
            }

            function ReplaceLocal(data, key)
            {
              if ( !_.isEmpty(data) )
                storage.set(STORAGEKEY+key, data);
            }

            function ReplaceRemote()
            {

              var obj = _.chain(localStorage)
                .pick(function(val, key){
                  return ~key.indexOf(STORAGEKEY);
                })
                .mapKeys(function(val, key){
                  return key.replace(STORAGEKEY, '')
                })
                .value();

              self.set(obj);

            }

            if ( callback )
              callback();

          });
          return this;
        }
      };

    };

    chrome.storage.onChanged.addListener(function(changes, namespace) {
      for (var key in _.omit(changes, 'lastSync')) {

        var storageChange = changes[key];

        /*
        console.log('Storage key "%s" in namespace "%s" changed. ' +
          'Old value was "%s", new value is "%s".',
          key,
          namespace,
          storageChange.oldValue,
          storageChange.newValue);

        // TODO:
        //UI.toast('<i class="fa fa-check"></i> Data synced');
        //storage.set(STORAGEKEY+key, storageChange.newValue);
        //*/
      }
    });

    var service = {
      remote: new ChromeSync('sync'),
      local: new ChromeSync('local')
    };

    return _.merge({}, service, {
      $get: service
    });
  }


})(window);
