'use strict';

(function () {
  var httpApi = angular.module('httpApi', []);
  
  httpApi.provider('httpApi', function ($provide, $httpProvider) {
    var host = undefined,
        useJSONSuffix = false;

    this.setHost = function (h) {
      host = h;
    };

    this.useJSONSuffix = function (bool) {
      useJSONSuffix = !!bool;
    };

    this.$get = function ($q, $http) {
      
      var _checkRelative = function (url) {
            return (_.isNull(url.match(/^https?:\/\//)));
          },
          _preProcess = function (url, routeParams, queryParams) {
            var newUrl = url;
            if (_checkRelative(url)) {
              newUrl = host + url;
            }
            newUrl = (function (url, params) {
              var p, v;
              for (p in params) {
                v = params[p];
                url = url.replace(':' + p, v);
              }
              return url;
            })(newUrl, routeParams);
            newUrl = (function (url, params) {
              var p, v;
              if (url.search(/\?/) == -1) {
                  url = url + '?';
              }
              for (p in params) {
                v = params[p];
                url = url + p + '=' + v + '&';
              }
              url = url.slice(0, -1);
              return url;
            })(newUrl, queryParams);

            if (useJSONSuffix) {
              newUrl = newUrl + '.json';
            }
            
            return newUrl;
          },
          _postProcess = function (responsePromise) {
            var d = $q.defer();
            responsePromise.then(function (response) {
              d.resolve(response.data.data);
            }, function (response) {
              d.reject(response);
            });
            return d.promise;
          };

      return {
        post: function (url, data, routeParams, queryParams) {
          return _postProcess($http.post(_preProcess(url, routeParams, queryParams), data));
        },
        get: function (url, routeParams, queryParams) {
          return _postProcess($http.get(_preProcess(url, routeParams, queryParams)));
        }
      };
    };

    $httpProvider.defaults.useXDomain = true;
  });
})();