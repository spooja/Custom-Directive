/// <reference path="D:\pooja\CustomDirectives\CustomDirectives\helloworld.html" />
myapp = angular.module("myapp", []);

myapp.controller('MyController', ['$scope', function ($scope) {
    $scope.customer = {
        name: 'pooja',
        address: 'vadodara'
    };
    $scope.naomi = {name: 'abc',address:'manjalpur'};
    $scope.igor = { name: 'pqr', address: 'karlibaug' };

    $scope.format = 'M/d/yy h:mm:ss a';

    $scope.text = 'this is test';
    $scope.employee = {
        name: 'pooja',
        address: 'Vadodara',
       
    };

    $scope.saveChanges = function (source) {
        alert("changes saved from " + source);
    };

}]);

myapp.directive('myCustomer', function () {
    return {
        template: 'Name: {{customer.name}} Address: {{customer.address}}'
    };
});

myapp.directive('templateUrl', function () {
    return {
        templateUrl: 'helloworld.html'
    };

});

myapp.directive('myName', function () {

    return {
        templateUrl: function (elem, attr) {
            return 'customer-' + attr.type + '.html';
        }
    };
});

myapp.directive('isolateScope', function () {
    return {
        restrict: 'E',
        scope: {
            customerInfo: '=info'
        },
        templateUrl: 'my-customer-iso.html'
    };

});

myapp.directive('myCurrentTime', ['$interval', 'dateFilter', function ($interval, dateFilter) {

    function link(scope, element, attrs) {

        var format,
            timeOutId;

        function updateTime() {
            element.text(dateFilter(new Date(), format));
        }

        scope.$watch(attrs.myCurrentTime, function (value) {
            format = value;
            updateTime();
        });

        element.on('$destroy', function () {
            $interval.cancel(timeoutId);
        });

        // start the UI update process; save the timeoutId for canceling
        timeoutId = $interval(function () {
            updateTime(); // update DOM
        }, 1000);
    }
    return {
        link: link
    };
}]);

myapp.directive('ckEditor', [function () {
    return {
        require: '?ngModel',
        restrict: 'C',
        link: function (scope, elm, attr, model) {
            var isReady = false;
            var data = [];
            var ck = CKEDITOR.replace(elm[0]);

            function setData() {
                if (!data.length) {
                    return;
                }

                var d = data.splice(0, 1);
                ck.setData(d[0] || '<span></span>', function () {
                    setData();
                    isReady = true;
                });
            }

            ck.on('instanceReady', function (e) {
                if (model) {
                    setData();
                }
            });

            elm.bind('$destroy', function () {
                ck.destroy(false);
            });

            if (model) {
                ck.on('change', function () {
                    scope.$apply(function () {
                        var data = ck.getData();
                        if (data == '<span></span>') {
                            data = null;
                        }
                        model.$setViewValue(data);
                    });
                });

                model.$render = function (value) {
                    if (model.$viewValue === undefined) {
                        model.$setViewValue(null);
                        model.$viewValue = null;
                    }

                    data.push(model.$viewValue);

                    if (isReady) {
                        isReady = false;
                        setData();
                    }
                };
            }

        }
    };
}]);

myapp.directive("myDire", function () {
    return {
        restrict: "E",
        scope: {
            name: "@",   // by value
            address: "=", // by reference
            save: "&"    // event
        },
        template:
          "<div>" +
          "  {{name | uppercase }}: <input ng-model='address' />" +
          "  <button ng-click='save()'>Save</button>" +
          "</div>",
    }
});
//myapp.directive('div', function () {

//    var directive = {};
//    directive.restrict = 'E';
//    directive.template = "My First Directive: {{}}";
//    return directive;

//});