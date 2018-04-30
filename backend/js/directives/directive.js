myApp.directive('dateModel', function ($filter, $timeout) {
    return {
        scope: {
            model: '=ngModel'
        },
        link: function ($scope, element, attrs) {
            console.log("in date model");
            $timeout(function () {
                console.log($filter('date')(new Date($scope.model), 'dd/MM/yyyy'));
                $scope.model = new Date($scope.model);
            }, 100);

        }
    };
});

myApp.directive('loading', function () {
    return {
        restrict: 'E',
        replace:true,
        template: '<div class="loading"><img src="http://www.nasa.gov/multimedia/videogallery/ajax-loader.gif" width="20" height="20" />LOADING...</div>',
        link: function (scope, element, attr) {
              scope.$watch('loading', function (val) {
                  if (val)
                      $(element).show();
                  else
                      $(element).hide();
              });
        }
      }
});

myApp.directive('ngConfirmClick', [
    function(){
        return {
            link: function (scope, element, attr) {
                var msg = attr.ngConfirmClick || "Are you sure?";
                var clickAction = attr.confirmedClick;
                element.bind('click',function (event) {
                    if ( window.confirm(msg) ) {
                        scope.$apply(clickAction)
                    }
                });
            }
        };
}]);

myApp.directive('imageonload', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('load', function () {
                scope.$apply(attrs.imageonload);
            });
        }
    };
});


myApp.directive('uploadImage', function ($http, $filter, $timeout) {
    return {
        templateUrl: 'views/directive/uploadFile.html',
        scope: {
            model: '=ngModel',
            type: "@type",
            callback: "&ngCallback"
        },
        link: function ($scope, element, attrs) {
            console.log($scope.model);
            $scope.showImage = function () {};
            $scope.check = true;
            if (!$scope.type) {
                $scope.type = "image";
            }
            $scope.isMultiple = false;
            $scope.inObject = false;
            if (attrs.multiple || attrs.multiple === "") {
                $scope.isMultiple = true;
                $("#inputImage").attr("multiple", "ADD");
            }
            if (attrs.noView || attrs.noView === "") {
                $scope.noShow = true;
            }
            // if (attrs.required) {
            //     $scope.required = true;
            // } else {
            //     $scope.required = false;
            // }

            $scope.$watch("image", function (newVal, oldVal) {
                console.log(newVal, oldVal);
                isArr = _.isArray(newVal);
                if (!isArr && newVal && newVal.file) {
                    $scope.uploadNow(newVal);
                } else if (isArr && newVal.length > 0 && newVal[0].file) {

                    $timeout(function () {
                        console.log(oldVal, newVal);
                        console.log(newVal.length);
                        _.each(newVal, function (newV, key) {
                            if (newV && newV.file) {
                                $scope.uploadNow(newV);
                            }
                        });
                    }, 100);

                }
            });

            if ($scope.model) {
                if (_.isArray($scope.model)) {
                    $scope.image = [];
                    _.each($scope.model, function (n) {
                        $scope.image.push({
                            url: n
                        });
                    });
                } else {
                    if (_.endsWith($scope.model, ".pdf")) {
                        $scope.type = "pdf";
                    }
                }

            }
            if (attrs.inobj || attrs.inobj === "") {
                $scope.inObject = true;
            }
            $scope.clearOld = function () {
                $scope.model = [];
            };
            $scope.uploadNow = function (image) {
                $scope.uploadStatus = "uploading";

                var Template = this;
                image.hide = true;
                var formData = new FormData();
                formData.append('file', image.file, image.name);
                $http.post(uploadurl, formData, {
                    headers: {
                        'Content-Type': undefined
                    },
                    transformRequest: angular.identity
                }).then(function (data) {
                    data = data.data;
                    $scope.uploadStatus = "uploaded";
                    if ($scope.isMultiple) {
                        if ($scope.inObject) {
                            $scope.model.push({
                                "image": data.data[0]
                            });
                        } else {
                            if (!$scope.model) {
                                $scope.clearOld();
                            }
                            $scope.model.push(data.data[0]);
                        }
                    } else {
                        if (_.endsWith(data.data[0], ".pdf")) {
                            $scope.type = "pdf";
                        } else {
                            $scope.type = "image";
                        }
                        $scope.model = data.data[0];
                        console.log($scope.model, 'model means blob');

                    }
                    $timeout(function () {
                        $scope.callback();
                    }, 100);

                });
            };
        }
    };
});



myApp.directive('onlyDigits', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, element, attr, ctrl) {
            var digits;

            function inputValue(val) {
                if (val) {
                    var otherVal = val + "";
                    if (attr.type == "text") {
                        digits = otherVal.replace(/[^0-9\-\.\\]/g, '');
                    } else {
                        digits = otherVal.replace(/[^0-9\-\.\\]/g, '');
                    }


                    if (digits !== val) {
                        ctrl.$setViewValue(digits);
                        ctrl.$render();
                    }
                    return parseInt(digits, 10);
                }
                return undefined;
            }
            ctrl.$parsers.push(inputValue);
        }
    };
});

myApp.directive('img', function ($compile, $parse) {
    return {
        restrict: 'E',
        replace: false,
        link: function ($scope, element, attrs) {
            var $element = $(element);
            if (!attrs.noloading) {
                $element.after("<img src='img/loading.gif' class='loading' />");
                var $loading = $element.next(".loading");
                $element.load(function () {
                    $loading.remove();
                    $(this).addClass("doneLoading");
                });
            } else {
                $($element).addClass("doneLoading");
            }
        }
    };
});

myApp.directive('fancyboxBox', function ($document) {
    return {
        restrict: 'EA',
        replace: false,
        link: function (scope, element, attr) {
            var $element = $(element);
            var target;
            if (attr.rel) {
                target = $("[rel='" + attr.rel + "']");
            } else {
                target = element;
            }

            target.fancybox({
                openEffect: 'fade',
                closeEffect: 'fade',
                closeBtn: true,
                helpers: {
                    media: {}
                }
            });
        }
    };
});

myApp.directive('menuOptions', function ($document) {
    return {
        restrict: 'C',
        replace: false,
        link: function (scope, element, attr) {
            var $element = $(element);
            $(element).on("click", function () {
                $(".side-header.opened-menu").toggleClass('slide-menu');
                $(".main-content").toggleClass('wide-content');
                $("footer").toggleClass('wide-footer');
                $(".menu-options").toggleClass('active');
            });

        }
    };
});

myApp.directive('oI', function ($document) {
    return {
        restrict: 'C',
        replace: false,
        link: function (scope, element, attr) {
            var $element = $(element);
            $element.click(function () {
                $element.parent().siblings().children("ul").slideUp();
                $element.parent().siblings().removeClass("active");
                $element.parent().children("ul").slideToggle();
                $element.parent().toggleClass("active");
                return false;
            });

        }
    };
});
myApp.directive('slimscroll', function ($document) {
    return {
        restrict: 'EA',
        replace: false,
        link: function (scope, element, attr) {
            var $element = $(element);
            $element.slimScroll({
                height: '400px',
                wheelStep: 10,
                size: '2px'
            });
        }
    };
});

myApp.directive('addressForm', function ($document) {
    return {
        templateUrl: 'views/directive/address-form.html',
        scope: {
            formData: "=ngModel",
            demoForm: "=ngValid"
        },
        restrict: 'EA',
        replace: false,
        controller: function ($scope, NgMap, NavigationService) {

            $scope.map = {};
            $scope.change = function () {
                NgMap.getMap().then(function (map) {
                    var latLng = {
                        lat: map.markers[0].position.lat(),
                        lng: map.markers[0].position.lng()
                    };
                    _.assign($scope.formData, latLng);
                });
            };
            var LatLongi = 0;
            $scope.getLatLng = function (address) {

                NavigationService.getLatLng(address, ++LatLongi, function (data, i) {

                    if (i == LatLongi) {
                        $scope.formData = _.assign($scope.formData, data.results[0].geometry.location);
                    }
                });
                // $http.get("http://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCn9ypqFNxdXt9Zu2YqLcdD1Xdt2wNul9s&address="+address);
            };

        },
        // link: function($scope, element, attr, NgMap) {
        //     var $element = $(element);
        //     $scope.demoForm = {};
        //     $scope.demoForm.lat = 19.0760;
        //     $scope.demoForm.long = 72.8777;
        //     $scope.map = {};
        //     $scope.change = function() {
        //       NgMap.getMap().then(function(map) {
        //         console.log(map);
        //       });
        //
        //     };
        //
        // }
    };
});

// myApp.directive('box', function ($uibModal) {
//     return {
//         templateUrl: 'views/directive/box.html',
//         scope: {
//             type: '=type',
//             model: '=ngModel'
//         },
//         link: function ($scope, element, attrs) {
//             $scope.model = {};
//             console.log($scope.model);
//             $scope.data = {};
//             $scope.eventModel = function (text) {
//                 $scope.type.state = text;
//                 var modalInstance = $uibModal.open({
//                     animation: $scope.animationsEnabled,
//                     templateUrl: '/backend/views/modal/modal.html',
//                     size: 'lg',
//                     scope: $scope
//                 });
//                 $scope.close = function (value) {
//                     callback(value);
//                     modalInstance.close("cancel");
//                 };
//             };
//             $scope.submitModal = function (moddata) {
//                 console.log(moddata);
//             };
//         }
//     };
// });

var aa = {};
myApp.directive('multipleSelect', function ($document, $timeout) {
    return {
        templateUrl: 'views/directive/multiple-select.html',
        scope: {
            model: '=ngModel',
            api: "@api",
            url: "@url",
            name: "@name",
            required: "@required",
            filter: "@filter",
            ngName: "=ngName",
            create: "@ngCreate",
            disabled: "=ngDisabled"

        },
        restrict: 'EA',
        replace: false,
        controller: 'MultipleSelectCtrl',
        link: function (scope, element, attr, NavigationService) {
            var $element = $(element);
            scope.activeKey = 0;
            scope.isRequired = true;
            if (scope.required === undefined) {
                scope.isRequired = false;
            }
            scope.typeselect = attr.typeselect;
            // $scope.searchNew()
            aa = $element;
            var maxItemLength = 40;
            var maxBoxLength = 200;
            $timeout(function () {

                $element.find(".typeText").keyup(function (event) {
                    var scrollTop = $element.find("ul.allOptions").scrollTop();
                    var optionLength = $element.find("ul.allOptions li").length;
                    if (event.keyCode == 40) {
                        scope.activeKey++;
                    } else if (event.keyCode == 38) {
                        scope.activeKey--;
                    } else if (event.keyCode == 13) {
                        $element.find("ul.allOptions li").eq(scope.activeKey).trigger("click");
                    }
                    if (scope.activeKey < 0) {
                        scope.activeKey = optionLength - 1;
                    }
                    if (scope.activeKey >= optionLength) {
                        scope.activeKey = 0;
                    }
                    var newScroll = -1;
                    var scrollVisibility = (scrollTop + maxBoxLength) - maxItemLength;
                    var currentItemPosition = scope.activeKey * maxItemLength;
                    if (currentItemPosition < scrollTop) {
                        newScroll = (maxItemLength * scope.activeKey);

                    } else if (currentItemPosition > scrollVisibility) {
                        newScroll = (maxItemLength * scope.activeKey);

                    }
                    if (newScroll != -1) {
                        $element.find("ul.allOptions").scrollTop(newScroll);
                    }

                    scope.$apply();
                });

            }, 100);

        }
    };
});



myApp.directive('viewField', function ($http, $filter) {
    return {
        templateUrl: 'views/directive/viewField.html',
        scope: {
            type: '=type',
            value: "=value"
        },
        link: function ($scope, element, attrs) {
            // console.log("$scope.type",$scope.type);
            if (!$scope.type.type) {
                $scope.type.type = "text";
            }
            $scope.form = {};
            $scope.objectDepth = function () {
                if (_.isObjectLike($scope.storeObj)) {
                    if ($scope.storeValue[$scope.storeObj.field]) {
                        $scope.form.model = $scope.storeValue[$scope.storeObj.tableRef][$scope.storeObj.field];
                        $scope.storeObj = $scope.storeObj.tableRef;
                        if (_.isObjectLike($scope.storeObj)) {
                            $scope.objectDepth();
                        }
                    }
                }
            };
            if (_.isObjectLike($scope.value[$scope.type.tableRef])) {
                $scope.storeObj = $scope.type;
                $scope.storeValue = $scope.value;
                $scope.objectDepth();

            } else {
                $scope.form.model = $scope.value[$scope.type.tableRef];
            }

            // $scope.showCSV=function(item){
            //     console.log("showCSV clicked");
            //     var fileName="http://localhost:8082/api/upload/readFile?file=".$scope.value;
            //     $scope.csvData=CSVToTable(fileName);
            //     console.log("csvData",$scope.csvData);
            //     // $scope.viewSingleRuleModal = function (singleRule) {
            //     //     console.log("viewSingleRuleModal", singleRule);
            //     //     $scope.singleRuleForModal = singleRule;
            //     //     $scope.singleRuleModal = $uibModal.open({
            //     //         animation: true,
            //     //         templateUrl: 'views/modal/SingleRuleModal.html',
            //     //         size: 'md',
            //     //         scope: $scope
            //     //     });
            //     // }
            // }
            $scope.template = "views/viewField/" + $scope.type.type + ".html";
        }
    };
});
myApp.directive('dateForm', function () {
    return {
        scope: {
            ngModel: '=ngModel'
        },
        link: function ($scope, element, attrs) {
            console.log($scope.ngModel);
        }
    };
});

myApp.directive('detailField', function ($http, $filter, JsonService) {
    return {
        templateUrl: 'views/directive/detailField.html',
        scope: {
            type: '=type',
            value: "=value",
            detailForm: "=form",
            formData: "=data",
        },
        controller: 'DetailFieldCtrl',
        link: function ($scope, element, attrs) {
            // console.log($scope.formData["firstDate"]);
            // $scope.$watch($scope.formData["firstDate"], validateDates);
            // $scope.$watch($scope.formData["lastDate"], validateDates);
             
            // function validateDates() {

            //     if (!$scope.formData) return;
            //     if ($scope.formData["firstDate"].$error.invalidDate || $scope.formData["lastDate"].$error.invalidDate) {
            //         $scope.formData["firstDate"].$setValidity("endBeforeStart", true);  //already invalid (per validDate directive)
            //     } else {
            //         //depending on whether the user used the date picker or typed it, this will be different (text or date type).  
            //         //creating a new date object takes care of that.  
            //         var endDate = new Date($scope.formData["lastDate"]);
            //         var startDate = new Date($scope.formData["firstDate"]);
            //         $scope.formData["firstDate"].$setValidity("endBeforeStart", endDate >= startDate);
            //     }
            // }

            $scope.condition = {};
            $scope.condition.hidePercentage = function() {
                if($scope.formData["amount"]>10){
                    return true;
                } else {
                    return false;
                }
            }

            $scope.condition.hideStartTransactionValue = function() {
                // console.log("$scope.formData in hideStertTransactionValue",$scope.formData["transactionOperator"].name);
                if($scope.formData["transactionOperator"]){

                    if($scope.formData["transactionOperator"].name=='Between'){
                        // console.log("if");
                        // $scope.formData["numberOfTransactionStart"]="";
                        return false;
                    } else {
                        // console.log("else");
                        $scope.formData["numberOfTransactionStart"]="";
                        return true;
                    }
                }else{
                    return true;
                }
            }

            $scope.condition.hideOutstandingEndAmountValue = function() {
                // console.log("$scope.formData in hideStertTransactionValue",$scope.formData["transactionOperator"].name);
                if($scope.formData["outstandingAmountOperator"]){

                    if($scope.formData["outstandingAmountOperator"].name=='Between'){
                        // console.log("if");
                        // $scope.formData["numberOfTransactionStart"]="";
                        return false;
                    } else {
                        // console.log("else");
                        $scope.formData["outstandingEndAmount"]="";
                        return true;
                    }
                }else{
                    return true;
                }
            }

            $scope.condition.hidepreviousRepaymentEndAmountValue = function() {
                // console.log("$scope.formData in hideStertTransactionValue",$scope.formData["transactionOperator"].name);
                if($scope.formData["previousRepaymentAmountOperator"]){

                    if($scope.formData["previousRepaymentAmountOperator"].name=='Between'){
                        // console.log("if");
                        // $scope.formData["numberOfTransactionStart"]="";
                        return false;
                    } else {
                        // console.log("else");
                        $scope.formData["previousRepaymentEndAmount"]="";
                        return true;
                    }
                }else{
                    return true;
                }
            }

            $scope.condition.hidepreviousRepaymentEndDpdValue = function() {
                // console.log("$scope.formData in hideStertTransactionValue",$scope.formData["transactionOperator"].name);
                if($scope.formData["previousRepaymentDpdOperator"]){

                    if($scope.formData["previousRepaymentDpdOperator"].name=='Between'){
                        // console.log("if");
                        // $scope.formData["numberOfTransactionStart"]="";
                        return false;
                    } else {
                        // console.log("else");
                        $scope.formData["previousRepaymentEndDpd"]="";
                        return true;
                    }
                }else{
                    return true;
                }
            }

            $scope.condition.hideDueSinceEndValue = function() {
                // console.log("$scope.formData in hideStertTransactionValue",$scope.formData["transactionOperator"].name);
                if($scope.formData["dueSinceOperator"]){

                    if($scope.formData["dueSinceOperator"].name=='Between'){
                        // console.log("if");
                        // $scope.formData["numberOfTransactionStart"]="";
                        return false;
                    } else {
                        // console.log("else");
                        $scope.formData["dueSinceEnd"]="";
                        return true;
                    }
                }else{
                    return true;
                }
            }

            $scope.condition.hidePrnDueEndAmountValue = function() {
                // console.log("$scope.formData in hideStertTransactionValue",$scope.formData["transactionOperator"].name);
                if($scope.formData["prnDueAmountOperator"]){

                    if($scope.formData["prnDueAmountOperator"].name=='Between'){
                        // console.log("if");
                        // $scope.formData["numberOfTransactionStart"]="";
                        return false;
                    } else {
                        // console.log("else");
                        $scope.formData["prnDueEndAmount"]="";
                        return true;
                    }
                }else{
                    return true;
                }
            }

            $scope.condition.hideFirstTransactionDate = function() {
                if($scope.formData["firstDate"] > $scope.formData["lastDate"]){
                    $scope.formData["firstDate"]=null; 
                    // console.log("in else",$scope.formData["firstDate"]," & ",$scope.formData["lastDate"]);
                    
                    alert("Last Date Should Be Greater Than First Date");
                }else{
                    console.log("in else",$scope.formData["firstDate"]," & ",$scope.formData["lastDate"]);
                }
            }

            $scope.condition.hideStartDate = function() {

                var startDate=new Date($scope.formData["startDate"]);
                var endDate=new Date($scope.formData["endDate"]);
                var startYear = startDate.getFullYear() + "";
                var startMonth = (startDate.getMonth() + 1) + "";
                var startDay = startDate.getDate() + "";

                var endYear = endDate.getFullYear() + "";
                var endMonth = (endDate.getMonth() + 1) + "";
                var endDay = endDate.getDate() + "";

                concatinatedStartDate=startYear + "/" + startMonth + "/" + startDay;
                finalStartDate=new Date(concatinatedStartDate);


                concatinatedEndDate=endYear + "/" + endMonth + "/" + endDay;
                finalEndDate=new Date(concatinatedEndDate);

                console.log(finalStartDate,"---",finalEndDate);
                if($scope.formData["startDate"] > $scope.formData["endDate"]){
                    $scope.formData["startDate"]=null; 
                    // console.log("in else",$scope.formData["firstDate"]," & ",$scope.formData["lastDate"]);
                    
                    alert("End Date Should Be Greater Than First Date 11");
                }else if(finalEndDate > finalStartDate){
                    console.log("in else if");
                    // console.log($scope.formData["startTime"]);
                    // console.log("in else",$scope.formData["startDate"]," & ",$scope.formData["endDate"]);
                }else{
                    if($scope.formData["startTime"]==undefined){

                    }else{

                    var startTime=$scope.formData["startTime"].replace(":", "");
                    console.log("changed time****-",startTime);
                    var endTime=$scope.formData["endTime"].replace(":", "");
                    console.log("changed endtime****-",endTime);
                    if(startTime>endTime){
                        $scope.formData["endTime"]=null;
                        alert("Start Date & Time should less than End Date & Time");
                    }else if(startTime==endTime){
                        $scope.formData["endTime"]=null;
                        alert("Start Date & Time should less than End Date & Time");
                    }

                    }
                }
            }            
            $scope.condition.hideValidFromDate = function() {
                if($scope.formData["validFrom"] > $scope.formData["validTo"]){
                    $scope.formData["validFrom"]=null; 
                    // console.log("in else",$scope.formData["firstDate"]," & ",$scope.formData["lastDate"]);
                    
                    alert("End Date Should Be Greater Than First Date");
                }else{
                    console.log("in else",$scope.formData["validFrom"]," & ",$scope.formData["validTo"]);
                }
            }

            $scope.condition.hideProcessingStartDate = function() {
                if($scope.formData["processingStartDate"] > $scope.formData["processingEndDate"]){
                    $scope.formData["processingStartDate"]=null; 
                    // console.log("in else",$scope.formData["firstDate"]," & ",$scope.formData["lastDate"]);
                    
                    alert("Processing End Date Should Be Greater Than Start Date");
                }else{
                    console.log("in else",$scope.formData["processingStartDate"]," & ",$scope.formData["processingEndDate"]);
                }
            }

            $scope.condition.hideExcludeStartDate = function() {
                if($scope.formData["excludeStartDate"] > $scope.formData["excludeEndDate"]){
                    $scope.formData["excludeStartDate"]=null; 
                    // console.log("in else",$scope.formData["firstDate"]," & ",$scope.formData["lastDate"]);
                    
                    alert("exclude End Date Should Be Greater Than Start Date");
                }else{
                    console.log("in else",$scope.formData["excludeStartDate"]," & ",$scope.formData["excludeEndDate"]);
                }
            }

            $scope.condition.hideRelativeRransactionStartDate = function() {
                if($scope.formData["relativeTransactionDate"] > $scope.formData["relativeTransactionEndDate"]){
                    $scope.formData["relativeTransactionDate"]=null; 
                    // console.log("in else",$scope.formData["firstDate"]," & ",$scope.formData["lastDate"]);
                    
                    alert("Relative Transaction End Date Should Be Greater Than Start Date");
                }else{
                    console.log("in else",$scope.formData["relativeTransactionDate"]," & ",$scope.formData["relativeTransactionEndDate"]);
                }
            }
            $scope.condition.hidePerUser = function() {
                // console.log("avinash");
                // if($scope.formData["isFirstTransaction"]=="true"){
                //     return true;
                // } else {
                //     return false;
                // }
            }


        }
    };
});