# Angular HTTP API
[![Coverage Status](https://coveralls.io/repos/petermelias/angular-http-api/badge.png?branch=master)](https://coveralls.io/r/petermelias/angular-http-api?branch=master)
[![Build Status](https://travis-ci.org/petermelias/angular-http-api.svg?branch=master)](https://travis-ci.org/petermelias/angular-http-api)
[![Dependency Status](https://david-dm.org/petermelias/angular-http-api.svg)](https://david-dm.org/petermelias/angular-http-api.svg)
[![NPM version](https://badge.fury.io/js/angular-http-api.svg)](http://badge.fury.io/js/angular-http-api)


The purpose of this library is to provide a very light API for making parameterized URL requests to an API server.

### Installation

```bash
npm install angular-http-api
# or
bower install angular-http-api
```

### Usage

```javascript
var app = angular.module('testApp', ['httpApi']);

app.config(function (httpApiProvider) {
  httpApiProvider.setHost('google.com');
  httpApiProvider.preferScheme('https');
});

app.factory('UserService', function (httpApi) {
  return {
    lookupUser: function (email) {
      httpApi.get('/user/:email', {email: email});
    },
    searchUser: function (name) {
      httpApi.get('/user/search', {}, {firstName: name});
    }
  };
});

app.controller('testCtrl', function (UserService) {
  $scope.user;
  $scope.matching = [];

  UserService.lookupUser('petermelias@gmail.com').then(function (user) {
    $scope.user = user;
  });
  // GET: https://google.com/user/petermelias@gmail.com

  UserService.searchUser('Peter').then(function (matches) {
    $scope.matching = matches;
  });
  // GET: https://google.com/user/search?firstName=peter
});
```

### License
MIT