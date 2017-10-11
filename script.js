angular.module('app', [ 'ui.router', 'ui.router.stateHelper' ]);

angular.module('app')
    .config([
    '$urlRouterProvider',
    'stateHelperProvider',
    function($urlRouterProvider, stateHelperProvider) {
        stateHelperProvider.state({
            name: 'list',
            template: '<ui-view/>',
            abstract: true,
            children: [{
                name: 'all',
                url : '/list',
                template: '<list />'
            },{
                name: 'add',
                url : '/list/add',
                template: '<add />'
            },{
                name: 'edit',
                url : '/list/edit/:id',
                template: '<edit />'
            }]
        });
    }])
    .service('LocalStorage', function() {
        this.get = function(id){
            return id ? localStorage.getItem(id) : localStorage;
        };
        this.save = function(value, id){
            function ID() {
                return '_' + Math.random().toString(36).substr(2, 9);
            };
            localStorage.setItem(id? id : ID(),value);
        };
        this.remove = function(id){
            localStorage.removeItem(id);
        };
    })
    .directive("list", function() {
        return {
            template : '<table><tr><th colspan="3">Item Value</th></tr>' +
            '<tr ng-repeat="(id,item) in list"><td ng-bind="item"></td><td><a ui-sref="list.edit({id: id})">edit</td><td><a href ng-click="removeItem(id)">remove</td></tr></table>',
            controller: function ($scope, LocalStorage) {
                $scope.list = LocalStorage.get();
                $scope.removeItem = function(id){
                    LocalStorage.remove(id);
                }
            }
        };
    })
    .directive("add", function() {
        return {
            template : '<div>Item Value <input type="text" ng-model="Value"></div><div><button ng-click="saveItem()" style="background-color: green; color: white;">Save</button> <a ui-sref="list.all"><< Go back</a></div>',
            controller: function ($scope, $state, LocalStorage) {
                $scope.saveItem = function(){
                    if($scope.Value.length&&$scope.Value.length>0) {
                        LocalStorage.save($scope.Value);
                    }
                    $state.go('list.all')
                };
            }
        };
    })
    .directive("edit", function() {
        return {
            template : '<div>Item Value <input type="text" ng-model="Value"></div><div><button ng-click="saveItem()" style="background-color: green; color: white;">Save</button> <a ui-sref="list.all"><< Go back</a></div>',
            controller: function ($scope, $state, LocalStorage, $stateParams) {
                $scope.saveItem = function(id){
                    if($scope.Value.length&&$scope.Value.length>0) {
                        LocalStorage.save($scope.Value,$stateParams.id);
                    }
                    $state.go('list.all')
                };
            }
        };
    });