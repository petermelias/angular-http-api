'use strict';

describe('HTTP API', function () {
  var _testModule = angular.module('test', function () {}),
      _httpApiProvider,
      _httpApiService,
      $httpBackend,
      getTestData = {
        '/': {url: 'https://google.com/'},
        '/parameter/:paramA': {url: 'https://google.com/parameter/alpha', routeParams: {paramA: 'alpha'}},
        '/query-param': {url: 'https://google.com/query-param?alpha=bravo', queryParams: {alpha: 'bravo'}},
        '/combined/:paramA': {url: 'https://google.com/combined/alpha?bravo=charlie', queryParams: {bravo: 'charlie'}, routeParams: {paramA: 'alpha'}}
      },
      postTestData = {
        '/': {
          url: 'https://google.com/',
          data: null,
        },
        '/posting': {
          url: 'https://google.com/posting',
          data: {
            age: 12,
            name: 'Smeagol'
          }
        },
        '/posting/:paramA': {
          url: 'https://google.com/posting/alpha',
          data: {
            age: 12,
            name: 'Smeagol'
          },
          routeParams: {
            paramA: 'alpha'
          }
        }
      },
      url, 
      testData;

  beforeEach(function () {
    _testModule.config(function (httpApiProvider) {
      _httpApiProvider = httpApiProvider;
    });

    _testModule.run(function (httpApi) {
      _httpApiService = httpApi;
    });

    module('httpApi', 'test');

    inject(function ($injector) {
      $httpBackend = $injector.get('$httpBackend');
      for (url in getTestData) {
        testData = getTestData[url];
        $httpBackend.whenGET(testData.url).respond(200, '');
      }

      for (url in postTestData) {
        testData = postTestData[url];
        $httpBackend.whenPOST(testData.url, testData.data).respond(200, '');
      }
    });
  });

  describe('test environment', function () {
    it('should register the provider config', function () {
      expect(_httpApiProvider).not.toBeUndefined();
    });
    it('should register the provider', function () {
      expect(_httpApiService).not.toBeUndefined();
    });
    it('should load the $httpBackend', function () {
      expect($httpBackend).not.toBeUndefined();
    });
  });

  describe('provider config', function () {
    it('should set the host value', function () {
      _httpApiProvider.setHost('google.com');
      expect(_httpApiService.endpoint()).toContain('google.com');
    });

    it('should set the scheme value', function () {
      expect(_httpApiService.endpoint()).toContain('https');
      _httpApiProvider.preferScheme('http');
      expect(_httpApiService.endpoint()).not.toContain('https');
    });

    it('should set the JSON suffix', function () {
      expect(_httpApiService.suffix()).toBeUndefined();
      _httpApiProvider.useJSONSuffix();
      expect(_httpApiService.suffix()).toBe('json');
    });
  });

  describe('service operation', function () {
    var spy = jasmine.createSpy();

    beforeEach(function () {
      _httpApiProvider.setHost('google.com');
    });

    it('should make parameterized get requests', function () {
      var url,
          testData,
          responsePromise,
          response;

      for (url in getTestData) {
        testData = getTestData[url];
        responsePromise = _httpApiService.get(url, testData.routeParams, testData.queryParams).then(spy);
        $httpBackend.flush();
        response = spy.mostRecentCall.args[0];
        expect(response.status).toEqual(200);
      }
    });

    it('should make parameterized POST requests', function () {
      var url,
          testData,
          responsePromise,
          response;

      for (url in postTestData) {
        testData = postTestData[url];
        responsePromise = _httpApiService.post(url, testData.data, testData.routeParams, testData.queryParams).then(spy);
        $httpBackend.flush();
        response = spy.mostRecentCall.args[0];
        expect(response.status).toEqual(200);
      }
    });
  });
});