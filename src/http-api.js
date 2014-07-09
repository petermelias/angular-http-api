'use strict';

(function () {
  var httpApi = angular.module('httpApi', []),
      _isRelativeUrl = function (url) {
        return (_.isNull(url.match(/^https?:\/\//)));
      },
      _replaceUrlParams = function (url, params) {
        var p, v;
        for (p in params) {
          v = params[p];
          url = url.replace(':' + p, v);
        }
        return url;
      },
      _replaceQueryParams = function (url, params) {
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
      },
      _parseUrl = function (url, host, scheme, suffix, routeParams, queryParams) {
        var newUrl = url;
        if (_isRelativeUrl(url)) {
          newUrl =  scheme + '://' + host + url;
        }
        newUrl = _replaceUrlParams(newUrl, routeParams);
        newUrl = _replaceQueryParams(newUrl, queryParams);
        if (suffix) {
          newUrl = newUrl + '.' + suffix;  
        }
        return newUrl;
      },
      _respond = function (responsePromise, deferral) {
        responsePromise.then(function (response) {
          deferral.resolve(response);
        }, function (response) {
          deferral.reject(response);
        });
        return deferral.promise;
      };
  
  httpApi.provider('httpApi', function ($provide, $httpProvider) {
    var _scheme = 'https',
        _suffix,
        _host;

    this.setHost = function (host) {
      _host = host;
    };

    this.useJSONSuffix = function () {
      _suffix = 'json';
    };

    this.preferScheme = function (scheme) {
      _scheme = scheme;
    };

    this.$get = function ($q, $http) {
      return {
        post: function (url, data, routeParams, queryParams) {
          return _respond(
            $http.post(
              _parseUrl(url, _host, _scheme, _suffix, routeParams, queryParams), data), 
            $q.defer());
        },
        get: function (url, routeParams, queryParams) {
          return _respond(
            $http.get(
              _parseUrl(url, _host, _scheme, _suffix, routeParams, queryParams)), 
            $q.defer());
        },
        endpoint: function () {
          return _scheme + '://' + _host;
        },
        suffix: function () {
          return _suffix;
        }
      };
    };
    $httpProvider.defaults.useXDomain = true;
  });
})();