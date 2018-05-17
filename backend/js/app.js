// JavaScript Document
var myApp = angular.module('myApp', [
    'ui.router',
    'pascalprecht.translate',
    'angulartics',
    'angulartics.google.analytics',
    'imageupload',
    "ngMap",
    "internationalPhoneNumber",
    'ui.bootstrap',
    'ui.select',
    'ngAnimate',
    'toastr',
    'textAngular',
    'ngSanitize',
    'angular-flexslider',
    'ngMap',
    'toggle-switch',
    'cfp.hotkeys',
    'ui.sortable',
    'ngclipboard',
    'dropdown-multiselect',
    'ui.multiselect',
    'angularjs-dropdown-multiselect'
]);

myApp.config(function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {
    // for http request with session
    $httpProvider.defaults.withCredentials = true;
    $stateProvider

        .state('dashboard', {
            url: "/dashboard",
            templateUrl: "views/template.html",
            controller: 'DashboardCtrl',
            cache:false
        })

        .state('login', {
            url: "/login",
            templateUrl: "views/login.html",
            controller: 'LoginCtrl',
            cache:false
        })

        .state('page', {
            url: "/page/:id/{page:.*}/{keyword:.*}",
            templateUrl: "views/template.html",
            controller: 'PageJsonCtrl',
            cache:false
        })

        .state('copyRule', {
            url: "/copyRule/:id",
            templateUrl: "views/template.html",
            controller: 'copyRuleCtrl',
            cache:false
        })

        .state('loginapp', {
            url: "/login/:id",
            templateUrl: "views/login.html",
            controller: 'LoginCtrl',
            cache:false
        })

        .state('country-list', {
            url: "/country-list/{page:.*}/{keyword:.*}",
            templateUrl: "views/template.html",
            controller: 'CountryCtrl',
            cache:false
            params: {
                page: "1",
                keyword: ""
            }
        })

        .state('createcountry', {
            url: "/country-create",
            templateUrl: "views/template.html",
            controller: 'CreateCountryCtrl',
            cache:false
        })

        .state('editcountry', {
            url: "/country-edit/:id",
            templateUrl: "views/template.html",
            controller: 'EditCountryCtrl',
            cache:false
        })

        .state('schema-creator', {
            url: "/schema-creator",
            templateUrl: "views/template.html",
            controller: 'SchemaCreatorCtrl',
            cache:false
        })

        .state('excel-upload', {
            url: "/excel-upload/:model",
            templateUrl: "views/template.html",
            controller: 'ExcelUploadCtrl',
            cache:false
        })

        .state('userExposure', {
            url: "/userExposure",
            templateUrl: "views/template.html",
            controller: 'userExposureCtrl',
            cache:false
        })

        .state('merchantExposure', {
            url: "/merchantExposure",
            templateUrl: "views/template.html",
            controller: 'merchantExposureCtrl',
            cache:false
        })

        .state('jagz', {
            url: "/jagz",
            templateUrl: "views/jagz.html",
            controller: 'JagzCtrl',
            cache:false
        });

    $urlRouterProvider.otherwise("/dashboard");
    $locationProvider.html5Mode(isproduction);
});

myApp.config(function ($translateProvider) {
    $translateProvider.translations('en', LanguageEnglish);
    $translateProvider.translations('hi', LanguageHindi);
    $translateProvider.preferredLanguage('en');
});