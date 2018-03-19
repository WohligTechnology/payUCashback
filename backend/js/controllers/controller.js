var globalfunction = {};
myApp.controller('DashboardCtrl', function ($scope, TemplateService, NavigationService, $timeout, $state) {
        //Used to name the .html file

        $scope.template = TemplateService.changecontent("dashboard");
        $scope.menutitle = NavigationService.makeactive("Dashboard");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        if (_.isEmpty($scope.navigation)) {
            $state.reload();
        }
        // var script = document.currentScript;
        // // var fullUrl = script.src;
        // console.log("88888888",script);
        //     $scope.uploadPic = function(file) {
        //     file.upload = Upload.upload({
        //       url: '/home/thirtysix/Documents/avinash/payUCashback/backend/uploads',
        //       data: {username: $scope.username, file: file},
        //     });

        //     file.upload.then(function (response) {
        //       $timeout(function () {
        //         file.result = response.data;
        //       });
        //     }, function (response) {
        //       if (response.status > 0)
        //         $scope.errorMsg = response.status + ': ' + response.data;
        //     }, function (evt) {
        //       // Math.min is to fix IE which reports 200% sometimes
        //       file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        //     });
        //     }
    })

    .controller('AccessController', function ($scope, TemplateService, NavigationService, $timeout, $state) {
        if ($.jStorage.get("accessToken")) {
            // $state.go("dashboard");
        } else {
            console.log("AccessController else");
            $state.go("login");
        }
    })

    .controller('JagzCtrl', function ($scope, TemplateService, NavigationService, $timeout, $state, $interval) {

        function toColor(num, red) {
            num >>>= 0;
            var b = num & 0xFF,
                g = (num & 0xFF00) >>> 8,
                r = (num & 0xFF0000) >>> 16,
                a = ((num & 0xFF000000) >>> 24) / 255;
            if (red == "red") {
                r = 255;
                b = 0;
                g = 0;
            }
            return "rgba(" + [r, g, b, a].join(",") + ")";
        }

        $scope.circles = _.times(360, function (n) {

            var radius = _.random(0, 10);
            return {
                width: radius,
                height: radius,
                background: toColor(_.random(-12525360, 12525360)),
                top: _.random(0, $(window).height()),
                left: _.random(0, $(window).width())
            };
        });

        function generateCircle() {
            _.each($scope.circles, function (n, index) {
                var radius = _.random(0, 10);
                n.width = radius;
                n.height = radius;
                n.background = toColor(_.random(-12525360, 12525360));
                if (count % 7 === 0 || count % 7 === 5 || count % 7 === 6) {
                    if (count % 7 === 6) {
                        n.background = toColor(_.random(-12525360, 12525360), "red");
                        // n.width = 3;
                        // n.height = 3;
                    }
                    var t = index * Math.PI / 180;
                    var x = (4.0 * Math.pow(Math.sin(t), 3));
                    var y = ((3.0 * Math.cos(t)) - (1.3 * Math.cos(2 * t)) - (0.6 * Math.cos(3 * t)) - (0.2 * Math.cos(4 * t)));
                    n.top = -50 * y + 300;
                    n.left = 50 * x + $(window).width() / 2;
                } else {
                    n.top = _.random(0, $(window).height());
                    n.left = _.random(0, $(window).width());
                }
            });
        }

        var count = 0;

        $interval(function () {
            count++;
            console.log("Version 1.1");
            generateCircle();
        }, 5000);

    })

    .controller('MultipleSelectCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $state, $stateParams, $filter, toastr) {
        var i = 0;
        $scope.getValues = function (filter, insertFirst) {

            var dataSend = {
                keyword: $scope.search.modelData,
                filter: filter,
                page: 1
            };
            if (dataSend.keyword === null || dataSend.keyword === undefined) {
                dataSend.keyword = "";
            }
            NavigationService[$scope.api](dataSend, ++i, function (data) {
                if (data.value) {
                    $scope.list = data.data.results;
                    if ($scope.search.modelData) {
                        $scope.showCreate = true;
                        _.each($scope.list, function (n) {
                            // if (n.name) {
                            if (_.lowerCase(n.name) == _.lowerCase($scope.search.modelData)) {
                                $scope.showCreate = false;
                                return 0;
                            }
                            // }else{
                            //     if (_.lowerCase(n.officeCode) == _.lowerCase($scope.search.modelData)) {
                            //       $scope.showCreate = false;
                            //       return 0;
                            //   }
                            // }

                        });
                    } else {
                        $scope.showCreate = false;

                    }
                    if (insertFirst) {
                        if ($scope.list[0] && $scope.list[0]._id) {
                            // if ($scope.list[0].name) {
                            $scope.sendData($scope.list[0]._id, $scope.list[0].name);
                            // }else{
                            //   $scope.sendData($scope.list[0]._id, $scope.list[0].officeCode);
                            // }
                        } else {
                            console.log("Making this happen");
                            // $scope.sendData(null, null);
                        }
                    }
                } else {
                    console.log("Making this happen2");
                    $scope.sendData(null, null);
                }


            });
        };


        $scope.search = {
            modelData: ""
        };

        $scope.listview = false;
        $scope.showCreate = false;
        $scope.typeselect = "";
        $scope.showList = function () {
            var areFiltersThere = true;
            var filter = {};
            if ($scope.filter) {
                filter = JSON.parse($scope.filter);
            }
            var filterName = {};
            if ($scope.filterName) {
                filterName = JSON.parse($scope.filterName);
            }

            function getName(word) {
                var name = filterName[word];
                if (_.isEmpty(name)) {
                    name = word;
                }
                return name;
            }

            if (filter) {
                _.each(filter, function (n, key) {
                    if (_.isEmpty(n)) {
                        areFiltersThere = false;
                        toastr.warning("Please enter " + getName(key));
                    }
                });
            }
            if (areFiltersThere) {
                $scope.listview = true;
                $scope.searchNew(true);
            }
        };
        $scope.closeList = function () {
            $scope.listview = false;
        };
        $scope.closeListSlow = function () {
            $timeout(function () {
                $scope.closeList();
            }, 500);
        };
        $scope.searchNew = function (dontFlush) {
            if (!dontFlush) {
                $scope.model = "";
            }
            var filter = {};
            if ($scope.filter) {
                filter = JSON.parse($scope.filter);
            }
            $scope.getValues(filter);
        };
        $scope.createNew = function (create) {
            var newCreate = $filter("capitalize")(create);
            var data = {
                name: newCreate
            };
            if ($scope.filter) {
                data = _.assign(data, JSON.parse($scope.filter));
            }
            NavigationService[$scope.create](data, function (data) {
                if (data.value) {
                    toastr.success($scope.name + " Created Successfully", "Creation Success");
                    $scope.model = data.data._id;
                    $scope.ngName = data.data.name;
                } else {
                    toastr.error("Error while creating " + $scope.name, "Error");
                }
            });
            $scope.listview = false;
        };
        $scope.sendData = function (val, name) {
            $scope.search.modelData = name;
            $scope.ngName = name;
            $scope.model = val;
            $scope.listview = false;
        };
        $scope.$watch('model', function (newVal, oldVal) {
            if ($scope.model) {
                if (_.isObject($scope.model)) {
                    $scope.sendData($scope.model._id, $scope.model.name);
                }
            }
        });
    })

    .controller('PageJsonCtrl', function ($scope, TemplateService, NavigationService, JsonService, $timeout, $state, $stateParams, $uibModal) {
        $scope.json = JsonService;
        $scope.template = TemplateService.changecontent("none");
        $scope.menutitle = NavigationService.makeactive("PayUCashback");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        JsonService.getJson($stateParams.id, function () {});

        globalfunction.confDel = function (callback) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'views/modal/conf-delete.html',
                size: 'sm',
                scope: $scope
            });
            $scope.close = function (value) {
                callback(value);
                modalInstance.close("cancel");
            };
        };

        globalfunction.openModal = function (callback) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'views/modal/modal.html',
                size: 'lg',
                scope: $scope
            });
            $scope.close = function (value) {
                callback(value);
                modalInstance.close("cancel");
            };
        };

        // globalfunction.confDel(function (value) {
        //     console.log(value);
        //     if (value) {
        //         NavigationService.apiCall(id, function (data) {
        //             if (data.value) {
        //                 $scope.showAllCountries();
        //                 toastr.success("Country deleted successfully.", "Country deleted");
        //             } else {
        //                 toastr.error("There was an error while deleting country", "Country deleting error");
        //             }
        //         });
        //     }
        // });

    })

    .controller('ViewCtrl', function ($scope, TemplateService, NavigationService, JsonService, $timeout, $state, $stateParams, $uibModal, toastr) {
        $scope.json = JsonService;
        $scope.template = TemplateService;
        var i = 0;
        $scope.selectArr = [];
        $scope.selectArrMarketing = [];
        $scope.selectArrPerformance = [];
        $scope.selectArrPerformanceRepay = [];
        $scope.selectArrMerchantExposureCategory = [];
        if ($stateParams.page && !isNaN(parseInt($stateParams.page))) {
            $scope.currentPage = $stateParams.page;
        } else {
            $scope.currentPage = 1;
        }
        console.log("$stateParams", $stateParams);
        // if($stateParams.stateName.passingId){
        //     console.log("inside");
        //     $scope.showId="$stateParams.stateName.passingId",$stateParams.stateName.passingId;
        // }


        //check page accessable or not
        console.log("roles of page", $scope.json.json.roles);
        if ($scope.json.json.roles) {
            console.log($scope.json.json.roles);
            if ($.jStorage.get("profile")) {
                var accessLevel = $.jStorage.get("profile").accessLevel;
                if ($scope.json.json.roles.includes(accessLevel)) {
                    console.log("you have access");

                    // return true;
                } else {
                    // return false;
                    console.log("you have no access");
                    toastr.error("You Have No Access To " + $scope.json.json.description + " Page");
                    $state.go("dashboard");
                }
            }
        }

        //check page accessable or not ends here

        //for filters function

        $scope.showFilter = function () {
            console.log("Filter Clicked");
            //for getting cashback rule filters data start
            if ($scope.json.json.filter == "ruleFilter") {
                NavigationService.apiCall("Merchant/search", {}, function (data) {
                    $scope.merchants = data.data.results;
                    console.log("$scope.merchants", $scope.merchants);
                });
            }

            //for getting cashback rule filters data end

            $scope.showFilterModal = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'views/filters/' + $scope.json.json.filter + '.html',
                size: 'lg',
                scope: $scope
            });
        };

        $scope.clearFilter = function () {
            console.log($stateParams.keyword);
            if (!_.isEmpty($stateParams.keyword)) {
                $state.go("page", {
                    id: $stateParams.id,
                    page: $stateParams.page,
                    keyword: ""
                });
            } else {
                $state.reload();
            }
            // 
        };
        //filters function ends here

        $scope.viewModal = false;
        $scope.editButton = false;
        $scope.deleteButton = false;
        $scope.copyButton = false;
        $scope.createButton = false;

        console.log("$scope.json ***", $scope.json);
        if ($.jStorage.get("accessToken")) {
            var profileData = $.jStorage.get("profile");
            if (profileData.accessLevel == "Admin") {
                $scope.viewModal = true;
                $scope.editButton = true;
                // $scope.deleteButton=false;
                $scope.copyButton = true;
                $scope.createButton = true;
            } else if (profileData.accessLevel == "Super Admin") {
                $scope.viewModal = true;
                $scope.editButton = true;
                // $scope.deleteButton=false;
                $scope.copyButton = true;
                $scope.createButton = true;
            } else if (profileData.accessLevel == "User") {
                $scope.viewModal = true;
            }
        }

        $scope.hasRole = function (roles) {
            // console.log("roles",roles);
            if (roles) {
                if ($.jStorage.get("profile")) {
                    var accessLevel = $.jStorage.get("profile").accessLevel;
                    if (roles.includes(accessLevel)) {
                        // console.log("you have access");
                        return true;
                    } else {
                        return false;
                    }
                }

            } else {
                return true;
            }

            // // var indexOfRole = $scope.roles.indexOf(role); // or whatever your object is instead of $scope.roles
            // if (indexOfRole === -1)
            //      return false;
            // else
            //      return true;
        }
        $scope.search = {
            keyword: ""
        };
        if ($stateParams.keyword) {
            $scope.search.keyword = $stateParams.keyword;
        }
        // $scope.checkboxClick = function (ruleObject) {
        //     console.log("id in checkboxClick", ruleObject);

        //     var today = new Date();
        //     var dd = today.getDate();
        //     var mm = today.getMonth() + 1; //January is 0!
        //     var yyyy = today.getFullYear();
        //     formattedAngularDate = dd + '/' + mm + '/' + yyyy;

        //     var arrStartDate = formattedAngularDate.split("/");
        //     var date1 = new Date(arrStartDate[2], arrStartDate[1], arrStartDate[0]);

        //     // formattedAngularDate = dd + '/' + mm + '/' + yyyy; //dd/mm/yyyy

        //     var mongoDate = ruleObject.validFrom;
        //     var mongoDateToDate = new Date(mongoDate);
        //     var dd1 = mongoDateToDate.getUTCDate();
        //     var mm1 = mongoDateToDate.getUTCMonth() + 1;
        //     var yyyy1 = mongoDateToDate.getUTCFullYear();
        //     formattedmongoDbDate = dd1 + '/' + mm1 + '/' + yyyy1;

        //     var arrEndDate = formattedmongoDbDate.split("/");
        //     var date2 = new Date(arrEndDate[2], arrEndDate[1], arrEndDate[0]);
        //     // formattedmongoDbDate = dd1 + '/' + mm1 + '/' + yyyy1;

        //     console.log("Both 1) Angular-", date1, " 2) Mongo-", date2);

        //     if (date1 < date2) {
        //         console.log("Today's Date is less than Rule Date");
        //     } else {
        //         var id = ruleObject._id;
        //         console.log("Today's Date is greater than Rule Date");
        //         var idx = $.inArray(id, $scope.selectArr);
        //         if (idx == -1) {
        //             $scope.selectArr.push(id);
        //             console.log("in if after push", $scope.selectArr);
        //         } else {
        //             $scope.selectArr.splice(idx, 1);
        //             console.log("in else after splice", $scope.selectArr);
        //         }
        //     }
        //     // NavigationService.playSelectedEmail(objectToSend, function (data) {
        //     //     console.log("*****", data);
        //     //     var count = data.data.cashbackCount;
        //     // });


        // }


        $scope.checkboxClick = function (id) {
            console.log("id in checkboxClick", id);
            var idx = $.inArray(id, $scope.selectArr);
            if (idx == -1) {
                $scope.selectArr.push(id);
                console.log("in if after push", $scope.selectArr);
            } else {
                $scope.selectArr.splice(idx, 1);
                console.log("in else after splice", $scope.selectArr);
            }
        }


        $scope.checkboxMarketingClick = function (id) {
            console.log("id in checkboxMarketingClick", id);
            var idx = $.inArray(id, $scope.selectArrMarketing);
            if (idx == -1) {
                $scope.selectArrMarketing.push(id);
                console.log("in if after push", $scope.selectArrMarketing);
            } else {
                $scope.selectArrMarketing.splice(idx, 1);
                console.log("in else after splice", $scope.selectArrMarketing);
            }
        }

        $scope.checkboxPerformanceClick = function (id) {

            console.log("id in checkboxPerformanceClick", id);

            var idx = $.inArray(id, $scope.selectArrPerformance);
            if (idx == -1) {
                $scope.selectArrPerformance.push(id);
                console.log("in if after push", $scope.selectArrPerformance);
            } else {
                $scope.selectArrPerformance.splice(idx, 1);
                console.log("in else after splice", $scope.selectArrPerformance);
            }
        }

        $scope.checkboxPerformanceRepayClick = function (id) {

            console.log("id in checkboxPerformanceRepayClick", id);

            var idx = $.inArray(id, $scope.selectArrPerformanceRepay);
            if (idx == -1) {
                $scope.selectArrPerformanceRepay.push(id);
                console.log("in if after push", $scope.selectArrPerformanceRepay);
            } else {
                $scope.selectArrPerformance.splice(idx, 1);
                console.log("in else after splice", $scope.selectArrPerformanceRepay);
            }
        }


        $scope.checkboxMerchantExposureCategoryClick = function (id) {

            console.log("id in checkboxMerchantExposureCategoryClick", id);

            var idx = $.inArray(id, $scope.selectArrMerchantExposureCategory);
            if (idx == -1) {
                $scope.selectArrMerchantExposureCategory.push(id);
                console.log("in if after push", $scope.selectArrMerchantExposureCategory);
            } else {
                $scope.selectArrMerchantExposureCategory.splice(idx, 1);
                console.log("in else after splice", $scope.selectArrMerchantExposureCategory);
            }
        }

        $scope.playSelectedClick = function () {
            if ($scope.selectArr.length == 0) {
                console.log("empty array inside playSelectedClick if");
                alert("Select Atleast One Rule For Procedding");
            } else {
                $scope.playSelectedFolderNameModal = $uibModal.open({
                    animation: true,
                    templateUrl: 'views/modal/playSelectedFolderNameModal.html',
                    size: 'md',
                    scope: $scope
                });
            }

        }

        $scope.playSelectedClickAfterFolderName = function (formData) {
            $scope.playSelectedFolderNameModal.close();
            if ($.jStorage.get("profile")) {
                var loggedInUserId = $.jStorage.get("profile")._id;
            } else {
                loggedInUserId = null;
            }
            var folder = formData.name;
            var objectToSend = {
                userId: loggedInUserId,
                folderName: folder
            };
            if ($scope.selectArr.length == 0) {
                console.log("empty array inside playSelectedClick if");
            } else {
                objectToSend.ruleIds = $scope.selectArr;
                console.log("selected id inside playSelectedClick else", objectToSend);

                NavigationService.playSelectedEmail(objectToSend, function (data) {
                    console.log("*****", data);
                    var count = data.data.cashbackCount;
                    if (data.data.success == true) {
                        toastr.success("Rules Played Successfully. Total Cashback Count is - " + count, {
                            "closeButton": true,
                            "debug": false,
                            "newestOnTop": false,
                            "progressBar": true,
                            "positionClass": "toast-top-center",
                            "preventDuplicates": false,
                            "onclick": null,
                            "timeOut": "4000",
                            "extendedTimeOut": "1000",
                            "tapToDismiss": false
                        });
                    } else {
                        toastr.error("Failed To Play Rules", {
                            "closeButton": true,
                            "debug": false,
                            "newestOnTop": false,
                            "progressBar": true,
                            "positionClass": "toast-top-center",
                            "preventDuplicates": false,
                            "onclick": null,
                            "timeOut": "2000",
                            "extendedTimeOut": "1000",
                            "tapToDismiss": false
                        });
                    }
                    $state.reload();
                    // if (data.value) {
                    //     console.log("in if returnData",data)
                    // }else{
                    //     console.log("in else returnData",data)
                    // }

                    // NavigationService.playSelectedEmail(objectToSend, function (data) {
                    //     console.log("*****",data);
                    //     var count=data.data.cashbackCount;
                    //     if(data.data.success==true){
                    //         $scope.playSelectedResponse=data.data;
                    //         $scope.playSelectedSuccess = $uibModal.open({
                    //             animation: true,
                    //             templateUrl: 'views/modal/playSelectedSuccess.html',
                    //             size: 'md',
                    //             scope: $scope
                    //         });
                    //     } else{

                    //     }
                    //     $state.reload();
                    // })

                })
            }
        }

        $scope.playSelectedAllClick = function () {
            console.log("allSelectedRules", $scope.allSelectedRules);
            if ($scope.allSelectedRules.length == 0) {
                console.log("empty array inside playSelectedAllClick if");
                alert("No Rules to Play");
            } else {
                $scope.playSelectedAllClickFolderNameModal = $uibModal.open({
                    animation: true,
                    templateUrl: 'views/modal/playAllRuleFolderNameModal.html',
                    size: 'md',
                    scope: $scope
                });
            }

        }

        $scope.playSelectedAllClickMarketing = function () {
            console.log("allSelectedMarketingRules", $scope.selectArrMarketing);
            if ($scope.selectArrMarketing.length == 0) {
                console.log("empty array inside playSelectedAllClickMarketing if");
                alert("No Marketing Rules to Play");
            } else if ($scope.selectArrMarketing.length > 1) {
                console.log("cannot play more than 1 rule!");
                alert("Please select only 1 Rule at a time to Play!!!");
            } else {
                $scope.playSelectedAllClickMarketingFolderNameModal = $uibModal.open({
                    animation: true,
                    templateUrl: 'views/modal/playAllMarketingRuleFolderNameModal.html',
                    size: 'md',
                    scope: $scope
                });
            }

        }

        $scope.playSelectedClickExposureMerchantCategory = function () {
            console.log("allSelectedMarketingRules", $scope.selectArrMerchantExposureCategory);
            if ($scope.selectArrMerchantExposureCategory.length == 0) {
                console.log("empty array inside playSelectedClickExposureMerchantCategory if");
                alert("No Marketing Rules to Play");
            } else if ($scope.selectArrMerchantExposureCategory.length > 1) {
                console.log("cannot play more than 1 rule!");
                alert("Please select only 1 Category at a time to Play the Rules!!!");
            } else {
                $scope.playAllExposureMerchantCategoryClickAfterFolderName({
                    name: "passedFolderName"
                });
                // $scope.playSelectedClickExposureMerchantCategoryFolderNameModal = $uibModal.open({
                //     animation: true,
                //     templateUrl: 'views/modal/playAllExposureMerchantCategoryFolderNameModal.html',
                //     size: 'md',
                //     scope: $scope
                // });
            }

        }

        $scope.playSelectedAllClickPerformance = function () {
            console.log("allSelectedPerformanceRules", $scope.selectArrPerformance);
            if ($scope.selectArrPerformance.length == 0) {
                console.log("empty array inside playSelectedAllClickPerformance if");
                alert("No Marketing Rules to Play");
            } else if ($scope.selectArrPerformance.length > 1) {
                console.log("cannot play more than 1 rule!");
                alert("Please select only 1 Rule at a time to Play!!!");
            } else {
                $scope.playSelectedAllClickPerformanceFolderNameModal = $uibModal.open({
                    animation: true,
                    templateUrl: 'views/modal/playPerformanceFolderNameModal.html',
                    size: 'md',
                    scope: $scope
                });
            }

        }

        $scope.playSelectedAllClickPerformanceRepay = function () {
            console.log("allSelectedPerformanceRules", $scope.selectArrPerformanceRepay);
            if ($scope.selectArrPerformanceRepay.length == 0) {
                console.log("empty array inside playSelectedAllClickPerformanceRepay if");
                alert("No Marketing Rules to Play");
            } else if ($scope.selectArrPerformanceRepay.length > 1) {
                console.log("cannot play more than 1 rule!");
                alert("Please select only 1 Rule at a time to Play!!!");
            } else {
                $scope.playSelectedAllClickPerformanceRepayFolderNameModal = $uibModal.open({
                    animation: true,
                    templateUrl: 'views/modal/playPerformanceRepayFolderNameModal.html',
                    size: 'md',
                    scope: $scope
                });
            }

        }

        $scope.playAllClickAfterFolderName = function (formData) {
            $scope.playSelectedAllClickFolderNameModal.close();
            // console.log("formData in playAllClickAfterFolderName",formData);
            if ($.jStorage.get("profile")) {
                var loggedInUserId = $.jStorage.get("profile")._id;
            } else {
                loggedInUserId = null;
            }
            var folder = formData.name;
            var objectToSend = {
                userId: loggedInUserId,
                folderName: folder
            };

            if ($scope.allSelectedRules.length == 0) {
                console.log("empty array inside playSelectedClick if");
                alert("No Rules To Play!!!");
            } else {
                objectToSend.ruleIds = $scope.allSelectedRules;
                console.log("selected id inside playSelectedClick else", objectToSend);

                NavigationService.playSelectedEmail(objectToSend, function (data) {
                    console.log("*****", data);
                    var count = data.data.cashbackCount;
                    if (data.data.success == true) {
                        toastr.success("Rules Played Successfully. Total Cashback Count is - " + count, {
                            "closeButton": true,
                            "debug": false,
                            "newestOnTop": false,
                            "progressBar": true,
                            "positionClass": "toast-top-center",
                            "preventDuplicates": false,
                            "onclick": null,
                            "timeOut": "4000",
                            "extendedTimeOut": "1000",
                            "tapToDismiss": false
                        });
                    } else {
                        toastr.error("Failed To Play Rules", {
                            "closeButton": true,
                            "debug": false,
                            "newestOnTop": false,
                            "progressBar": true,
                            "positionClass": "toast-top-center",
                            "preventDuplicates": false,
                            "onclick": null,
                            "timeOut": "2000",
                            "extendedTimeOut": "1000",
                            "tapToDismiss": false
                        });
                    }
                    $state.reload();

                })
            }
        }
        $scope.playAllMarketingClickAfterFolderName = function (formData) {
            $scope.playSelectedAllClickMarketingFolderNameModal.close();
            // console.log("formData in playAllClickAfterFolderName",formData);
            if ($.jStorage.get("profile")) {
                var loggedInUserId = $.jStorage.get("profile")._id;
            } else {
                loggedInUserId = null;
            }
            var folder = formData.name;
            var objectToSend = {
                userId: loggedInUserId,
                folderName: folder
            };

            if ($scope.selectArrMarketing.length == 0) {
                console.log("empty array inside playSelectedClick if");
                alert("No Rules To Play!!!");
            } else {
                objectToSend.ruleIds = $scope.selectArrMarketing;
                console.log("selected id inside playSelectedClick else", objectToSend);

                NavigationService.playSelectedMarketingRule(objectToSend, function (data) {
                    console.log("*****", data);
                    var count = data.data.cashbackCount;
                    if (data.data.success == true) {
                        toastr.success("Rules Played Successfully. Total Cashback Count is - " + count, {
                            "closeButton": true,
                            "debug": false,
                            "newestOnTop": false,
                            "progressBar": true,
                            "positionClass": "toast-top-center",
                            "preventDuplicates": false,
                            "onclick": null,
                            "timeOut": "4000",
                            "extendedTimeOut": "1000",
                            "tapToDismiss": false
                        });
                    } else {
                        toastr.error("Failed To Play Rules", {
                            "closeButton": true,
                            "debug": false,
                            "newestOnTop": false,
                            "progressBar": true,
                            "positionClass": "toast-top-center",
                            "preventDuplicates": false,
                            "onclick": null,
                            "timeOut": "2000",
                            "extendedTimeOut": "1000",
                            "tapToDismiss": false
                        });
                    }
                    $state.reload();

                })
            }
        }
        // $scope.playAllMarketingClickAfterFolderName = function (formData) {
        //     $scope.playSelectedAllClickMarketingFolderNameModal.close();
        //     // console.log("formData in playAllClickAfterFolderName",formData);
        //     if ($.jStorage.get("profile")) {
        //         var loggedInUserId = $.jStorage.get("profile")._id;
        //     } else {
        //         loggedInUserId = null;
        //     }
        //     var folder = formData.name;
        //     var objectToSend = {
        //         userId: loggedInUserId,
        //         folderName: folder
        //     };

        //     if ($scope.selectArrMarketing.length == 0) {
        //         console.log("empty array inside playSelectedClick if");
        //         alert("No Rules To Play!!!");
        //     } else {
        //         objectToSend.ruleIds = $scope.selectArrMarketing;
        //         console.log("selected id inside playSelectedClick else", objectToSend);
        //         $scope.playMarketingRuleResponse={
        //             url:"/test1/test1.csv",
        //             cashbackCount:"120"
        //         };
        //         $scope.playMarketingRuleResponseModal = $uibModal.open({
        //             animation: true,
        //             templateUrl: 'views/modal/playMarketingRuleResponseModal.html',
        //             size: 'md',
        //             scope: $scope
        //         });
        //         // NavigationService.playSelectedMarketingRule(objectToSend, function (data) {
        //         //     console.log("*****", data);
        //         //     var count = data.data.cashbackCount;
        //         //     if (data.data.success == true) {
        //         //         $scope.playMarketingRuleResponse=data.data;
        //         //         $scope.playMarketingRuleResponseModal = $uibModal.open({
        //         //             animation: true,
        //         //             templateUrl: 'views/modal/playMarketingRuleResponseModal.html',
        //         //             size: 'md',
        //         //             scope: $scope
        //         //         });
        //         //         // toastr.success("Rules Played Successfully. Total Cashback Count is - " + count, {
        //         //         //     "closeButton": true,
        //         //         //     "debug": false,
        //         //         //     "newestOnTop": false,
        //         //         //     "progressBar": true,
        //         //         //     "positionClass": "toast-top-center",
        //         //         //     "preventDuplicates": false,
        //         //         //     "onclick": null,
        //         //         //     "timeOut": "4000",
        //         //         //     "extendedTimeOut": "1000",
        //         //         //     "tapToDismiss": false
        //         //         // });
        //         //     } else {
        //         //         toastr.error("Failed To Play Rules", {
        //         //             "closeButton": true,
        //         //             "debug": false,
        //         //             "newestOnTop": false,
        //         //             "progressBar": true,
        //         //             "positionClass": "toast-top-center",
        //         //             "preventDuplicates": false,
        //         //             "onclick": null,
        //         //             "timeOut": "2000",
        //         //             "extendedTimeOut": "1000",
        //         //             "tapToDismiss": false
        //         //         });
        //         //     }
        //         //     $state.reload();

        //         // })
        //     }
        // }

        $scope.getMailMarketingRule = function (url) {
            console.log("inside getMailMarketingRule url", url);
        }


        $scope.playAllPerformanceClickAfterFolderName = function (formData) {
            $scope.playSelectedAllClickPerformanceFolderNameModal.close();
            // console.log("formData in playAllClickAfterFolderName",formData);
            if ($.jStorage.get("profile")) {
                var loggedInUserId = $.jStorage.get("profile")._id;
            } else {
                loggedInUserId = null;
            }
            var folder = formData.name;
            var objectToSend = {
                userId: loggedInUserId,
                folderName: folder
            };

            if ($scope.selectArrPerformance.length == 0) {
                console.log("empty array inside playSelectedClick if");
                alert("No Rules To Play!!!");
            } else {
                $scope.json.json.loader = true;
                objectToSend.ruleIds = $scope.selectArrPerformance;
                console.log("selected id inside playSelectedClick else", objectToSend);


                objectToSend.ruleIds = $scope.selectArrPerformance;
                var performanceId = $scope.selectArrPerformance[0];
                NavigationService.getOnePerformance(performanceId, function (data9) {
                    console.log("*****", data9);
                    if (data9.data) {

                        var merchantsSql = [];
                        if (data9.data.merchant.length > 0) {
                            for (var i = 0; i < data9.data.merchant.length; i++) {
                                merchantsSql.push(data9.data.merchant[i].merchantSqlId)
                            }

                        }
                        // objectToSend.merchantFlag = $scope.selectArrPerformance;
                        console.log("in if getOnePerformance controller length", data9.data.merchant.length);
                        // if(data9.data.merchant.length==0){
                        //     console.log("length=0");
                        //     objectToSend.merchants=data9.data.merchant;
                        // }else{
                        //     objectToSend.merchants=data9.data.merchant;
                        //     console.log("length=1");
                        // }
                        objectToSend.merchants = merchantsSql;
                        NavigationService.playSelectedPerformanceRule(objectToSend, function (data) {
                            console.log("*****", data);
                            if (data) {
                                $scope.json.json.loader = false;
                            } else {
                                $scope.json.json.loader = false;
                            }

                            // var totalAmount = data.data.totalAmount;
                            // var totalAmountWithDecimal=totalAmount.toLocaleString();
                            // var numberOfUsers = data.data.numberOfUsers;
                            // var numberOfTransactions = data.data.numberOfTransactions;
                            // var totalUsersInFile = data.data.totalUsersInFile;

                            //data for modal
                            var totalUsersInFile = data.data.totalUsersInFile;
                            var numberOfUniqueUsers = data.data.numberOfUniqueUsers;
                            var totalAmountOverall = data.data.totalAmountOverall;
                            var numberOfTransactionsOverall = data.data.numberOfTransactionsOverall;

                            $scope.playPerformanceResponse = {
                                totalUsersInFile: totalUsersInFile,
                                numberOfUniqueUsers: data.data.numberOfUniqueUsers,
                                totalAmountOverall: data.data.totalAmountOverall,
                                numberOfTransactionsOverall: data.data.numberOfTransactionsOverall
                            }

                            if (data.data.numberOfUniqueUsersOtherMerchants) {
                                $scope.playPerformanceResponse.numberOfUniqueUsersOtherMerchants = data.data.numberOfUniqueUsersOtherMerchants;
                                $scope.playPerformanceResponse.numberOfTransactionsOtherMerchants = data.data.numberOfTransactionsOtherMerchants;
                                $scope.playPerformanceResponse.totalAmountOtherMerchants = data.data.totalAmountOtherMerchants;
                                $scope.playPerformanceResponse.numberOfUniqueUsersGivenMerchants = data.data.numberOfUniqueUsersGivenMerchants;
                                $scope.playPerformanceResponse.numberOfTransactionsGivenMerchants = data.data.numberOfTransactionsGivenMerchants;
                                $scope.playPerformanceResponse.totalAmountGivenMerchants = data.data.totalAmountGivenMerchants;

                            }
                            // $scope.playPerformanceResponse={
                            //     "numberOfUniqueUsers":2,
                            //     "success":true,
                            //     "totalUsersInFile":2,
                            //     "numberOfTransactionsOverall":4,
                            //     "totalAmountOverall":"2050"
                            // }
                            if (data.data.success == true) {
                                $scope.playPerformanceResponseModal = $uibModal.open({
                                    animation: true,
                                    templateUrl: 'views/modal/playPerformanceResponseModal.html',
                                    size: 'md',
                                    scope: $scope
                                });
                            } else {
                                toastr.error("Failed To Play Rule ! Try Again !!!", {
                                    "closeButton": true,
                                    "debug": false,
                                    "newestOnTop": false,
                                    "progressBar": true,
                                    "positionClass": "toast-top-center",
                                    "preventDuplicates": false,
                                    "onclick": null,
                                    "timeOut": "3000",
                                    "extendedTimeOut": "1000",
                                    "tapToDismiss": false
                                });
                            }
                            // $state.reload();

                        })
                    } else {
                        console.log("something failed while getting merchant", data9);
                    }
                })
                console.log("selected id inside playSelectedClick else", objectToSend);

            }
        }

        $scope.playAllPerformanceRepayClickAfterFolderName = function (formData) {
            $scope.playSelectedAllClickPerformanceRepayFolderNameModal.close();
            // console.log("formData in playAllClickAfterFolderName",formData);
            if ($.jStorage.get("profile")) {
                var loggedInUserId = $.jStorage.get("profile")._id;
            } else {
                loggedInUserId = null;
            }
            var folder = formData.name;
            var objectToSend = {
                userId: loggedInUserId,
                folderName: folder
            };

            if ($scope.selectArrPerformanceRepay.length == 0) {
                console.log("empty array inside playSelectedClick if");
                alert("No Rules To Play!!!");
            } else {
                $scope.json.json.loader = true;
                objectToSend.ruleIds = $scope.selectArrPerformanceRepay;
                console.log("selected id inside playSelectedClick else", objectToSend);

                NavigationService.playSelectedPerformanceRepayRule(objectToSend, function (data) {
                    console.log("*****", data);
                    if (data) {
                        $scope.json.json.loader = false;
                    } else {
                        $scope.json.json.loader = false;
                    }
                    var totalAmount = data.data.totalAmount;
                    var totalAmountWithDecimal = totalAmount.toLocaleString();
                    var numberOfUsers = data.data.numberOfUsers;
                    var numberOfTransactions = data.data.numberOfTransactions;
                    var totalUsersInFile = data.data.totalUsersInFile;

                    //data for modal
                    $scope.playPerformanceResponse = {
                        totalAmount: totalAmountWithDecimal,
                        numberOfUsers: data.data.numberOfUsers,
                        numberOfTransactions: data.data.numberOfTransactions,
                        totalUsersInFile: data.data.totalUsersInFile
                    }

                    if (data.data.success == true) {
                        $scope.playPerformanceResponseModal = $uibModal.open({
                            animation: true,
                            templateUrl: 'views/modal/playPerformanceRepayResponseModal.html',
                            size: 'md',
                            scope: $scope
                        });
                    } else {
                        toastr.error("Failed To Play Rule ! Try Again !!!", {
                            "closeButton": true,
                            "debug": false,
                            "newestOnTop": false,
                            "progressBar": true,
                            "positionClass": "toast-top-center",
                            "preventDuplicates": false,
                            "onclick": null,
                            "timeOut": "3000",
                            "extendedTimeOut": "1000",
                            "tapToDismiss": false
                        });
                    }
                    // $state.reload();

                })
            }
        }

        $scope.playAllExposureMerchantCategoryClickAfterFolderNameTest = function (formData) {
            console.log("inside playAllExposureMerchantCategoryClickAfterFolderNameOld ***", formData);
        }

        $scope.playAllExposureMerchantCategoryClickAfterFolderName = function (formData) {
            // $scope.playSelectedClickExposureMerchantCategoryFolderNameModal.close();
            // console.log("formData in playAllClickAfterFolderName",formData);
            if ($.jStorage.get("profile")) {
                var loggedInUserId = $.jStorage.get("profile")._id;
            } else {
                loggedInUserId = null;
            }
            var folder = formData.name;
            var objectToSend = {
                userId: loggedInUserId,
                folderName: folder
            };

            if ($scope.selectArrMerchantExposureCategory.length == 0) {
                console.log("empty array inside playSelectedClick if");
                alert("No Rules To Play!!!");
            } else {
                $scope.json.json.loader = true;
                objectToSend.categoryId = $scope.selectArrMerchantExposureCategory[0];
                console.log("selected id inside playSelectedClick else", objectToSend);
                // $timeout(function () {
                //     $scope.json.json.loader=false;
                //     $scope.afterTimeoutModalData="Mail Will Be Send After Processing.";
                //     $scope.afterTimeoutModalInstance = $uibModal.open({
                //         animation: true,
                //         templateUrl: 'views/modal/afterTimeoutModal.html',
                //         size: 'md',
                //         scope: $scope
                //     });
                // }, 2000);
                NavigationService.playSelectedExposureMerchantCategoryRule(objectToSend, function (data) {
                    console.log("*****", data);
                    if (data) {
                        $scope.json.json.loader = false;
                    } else {
                        $scope.json.json.loader = false;
                    }

                    if (data.data.status == true) {
                        toastr.success(data.data.message, {
                            "closeButton": true,
                            "debug": false,
                            "newestOnTop": false,
                            "progressBar": true,
                            "positionClass": "toast-top-center",
                            "preventDuplicates": false,
                            "onclick": null,
                            "timeOut": "3000",
                            "extendedTimeOut": "1000",
                            "tapToDismiss": false
                        });
                    } else {
                        toastr.error("Failed To Play Rule ! Try Again !!!", {
                            "closeButton": true,
                            "debug": false,
                            "newestOnTop": false,
                            "progressBar": true,
                            "positionClass": "toast-top-center",
                            "preventDuplicates": false,
                            "onclick": null,
                            "timeOut": "3000",
                            "extendedTimeOut": "1000",
                            "tapToDismiss": false
                        });
                    }

                })
            }
        }
        $scope.playSelectedAllActiveClick = function () {
            console.log("allSelectedActiveRules", $scope.allSelectedActiveRules);
            if ($scope.allSelectedRules.length == 0) {
                console.log("empty array inside playSelectedAllClick if");
                alert("No Rules to Play");
            } else {
                $scope.playSelectedAllActiveClickFolderNameModal = $uibModal.open({
                    animation: true,
                    templateUrl: 'views/modal/playAllActiveRuleFolderNameModal.html',
                    size: 'md',
                    scope: $scope
                });
            }

        }


        $scope.playAllActiveClickAfterFolderName = function (formData) {
            $scope.playSelectedAllActiveClickFolderNameModal.close();
            // console.log("formData in playAllClickAfterFolderName",formData);
            if ($.jStorage.get("profile")) {
                var loggedInUserId = $.jStorage.get("profile")._id;
            } else {
                loggedInUserId = null;
            }
            var folder = formData.name;
            var objectToSend = {
                userId: loggedInUserId,
                folderName: folder
            };

            if ($scope.allSelectedActiveRules.length == 0) {
                console.log("empty array inside playAllActiveClickAfterFolderName if");
                alert("No Rules To Play!!!");
            } else {
                objectToSend.ruleIds = $scope.allSelectedActiveRules;
                console.log("selected id inside playSelectedClick else", objectToSend);

                NavigationService.playSelectedEmail(objectToSend, function (data) {
                    console.log("*****", data);
                    var count = data.data.cashbackCount;
                    if (data.data.success == true) {
                        toastr.success("Rules Played Successfully. Total Cashback Count is - " + count, {
                            "closeButton": true,
                            "debug": false,
                            "newestOnTop": false,
                            "progressBar": true,
                            "positionClass": "toast-top-center",
                            "preventDuplicates": false,
                            "onclick": null,
                            "timeOut": "4000",
                            "extendedTimeOut": "1000",
                            "tapToDismiss": false
                        });
                    } else {
                        toastr.error("Failed To Play Rules", {
                            "closeButton": true,
                            "debug": false,
                            "newestOnTop": false,
                            "progressBar": true,
                            "positionClass": "toast-top-center",
                            "preventDuplicates": false,
                            "onclick": null,
                            "timeOut": "2000",
                            "extendedTimeOut": "1000",
                            "tapToDismiss": false
                        });
                    }
                    $state.reload();

                })
            }
        }


        $scope.viewSingleRuleModal = function (singleRule) {
            console.log("viewSingleRuleModal", singleRule);
            $scope.singleRuleForModal = singleRule;
            $scope.singleRuleModal = $uibModal.open({
                animation: true,
                templateUrl: 'views/modal/SingleRuleModal.html',
                size: 'md',
                scope: $scope
            });
        }

        $scope.viewSingleMarketingRuleModal = function (singleMarketingRule) {
            console.log("viewSingleMarketingRuleModal", singleMarketingRule);
            $scope.singleMarketingRuleForModal = singleMarketingRule;
            $scope.singleMarketingRule = $uibModal.open({
                animation: true,
                templateUrl: 'views/modal/SingleMarketingRuleModal.html',
                size: 'md',
                scope: $scope
            });
        }

        // Exposure Merchant view button click start
        $scope.viewSingleExposureMerchantModal = function (exposureMerchant) {
            console.log("viewexposureMerchantModal", exposureMerchant);
            $scope.showTreeData = false;
            NavigationService.viewSingleExposureMerchantModal(exposureMerchant._id, function (data) {
                console.log("verifyQuery", data);
                if (data.data) {
                    $scope.singleExposureMerchantData = data.data.results;
                    $scope.singleExposureMerchantForModal = exposureMerchant;
                    $scope.singleExposureMerchantForModalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'views/modal/singleExposureMerchantForModal.html',
                        size: 'lg',
                        scope: $scope
                    });
                } else {
                    alert("errrrr");
                    // $scope.queryToShow = "Something Went Wrong: Server is Failed to Generate Query."
                    // $scope.singleRuleModal = $uibModal.open({
                    //     animation: true,
                    //     templateUrl: 'views/modal/queryModal.html',
                    //     size: 'lg',
                    //     scope: $scope
                    // });

                }

            })

            // $scope.singleExposureMerchantData={};
            // $scope.singleExposureMerchantForModal = exposureMerchant;
            // $scope.singleExposureMerchantForModalInstance = $uibModal.open({
            //     animation: true,
            //     templateUrl: 'views/modal/singleExposureMerchantForModal.html',
            //     size: 'lg',
            //     scope: $scope
            // });

        }

        // Exposure Merchant view button click end

        $scope.showTreeDataFunction = function () {
            $scope.showTreeData = true;
        }


        // Exposure Merchant Category view button click start
        $scope.viewSingleExposureMerchantCategoryModal = function (exposureMerchantCategory) {
            console.log("viewexposureMerchantCategoryModal", exposureMerchantCategory);

            $scope.singleExposureMerchantCategoryForModal = exposureMerchantCategory;
            $scope.singleExposureMerchantCategoryForModalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/modal/singleExposureMerchantCategoryForModal.html',
                size: 'md',
                scope: $scope
            });

        }
        // Exposure Merchant Category view button click end

        // Exposure Rule view button click start
        $scope.viewSingleExposureRuleModal = function (exposureRule) {
            console.log("viewexposureRuleModal", exposureRule);

            $scope.singleExposureRuleForModal = exposureRule;
            $scope.singleExposureRuleForModalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/modal/singleExposureRuleForModal.html',
                size: 'md',
                scope: $scope
            });

        }
        // Exposure Rule view button click end

        // Mailer List view button click start
        $scope.viewSingleMailerListModal = function (mailerList) {
            console.log("viewmailerListModal", mailerList);

            $scope.singleMailerListForModal = mailerList;
            $scope.singleMailerListForModalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/modal/singleMailerListForModal.html',
                size: 'md',
                scope: $scope
            });

        }
        // Mailer List view button click end


        $scope.viewQueryModal = function (singleRule) {
            $scope.copied = "Copy Query";
            // console.log("viewSingleRuleModal",singleRule);
            var objectToSend = {
                ruleId: singleRule._id
            };
            console.log(objectToSend);

            NavigationService.viewQueryModal(objectToSend, function (data) {
                console.log("verifyQuery", data);
                var query = data.data.cashbackQuery;
                $scope.queryToShow = query;
                if (data.data.success == true) {
                    $scope.singleRuleModal = $uibModal.open({
                        animation: true,
                        templateUrl: 'views/modal/queryModal.html',
                        size: 'lg',
                        scope: $scope
                    });
                } else {
                    $scope.queryToShow = "Something Went Wrong: Server is Failed to Generate Query."
                    $scope.singleRuleModal = $uibModal.open({
                        animation: true,
                        templateUrl: 'views/modal/queryModal.html',
                        size: 'lg',
                        scope: $scope
                    });

                }

            })

        }

        $scope.viewMarketingRuleQueryModal = function (singleRule) {
            $scope.copied = "Copy Query";
            // console.log("viewSingleRuleModal",singleRule);
            var objectToSend = {
                ruleId: singleRule._id
            };
            console.log(objectToSend);

            NavigationService.viewMarketingQueryModal(objectToSend, function (data) {
                console.log("verifyQuery in viewMarketingQueryModal", data);
                var query = data.data.cashbackQuery;
                $scope.queryToShow = query;
                if (data.data.success == true) {
                    $scope.singleRuleModal = $uibModal.open({
                        animation: true,
                        templateUrl: 'views/modal/queryModal.html',
                        size: 'lg',
                        scope: $scope
                    });
                } else {
                    $scope.queryToShow = "Something Went Wrong: Server is Failed to Generate Query."
                    $scope.singleRuleModal = $uibModal.open({
                        animation: true,
                        templateUrl: 'views/modal/queryModal.html',
                        size: 'lg',
                        scope: $scope
                    });

                }

            })

        }

        $scope.clickChangeAllButton = function () {
            console.log("inside clickChangeAllButton");
            $scope.changeAllValues = $uibModal.open({
                animation: true,
                templateUrl: 'views/modal/changeAllValuesModal.html',
                size: 'md',
                scope: $scope
            });
        }
        $scope.changeAllValuesModalSubmit = function (formData) {
            console.log("inside changeAllValuesModalSubmit", formData);
            if ($.jStorage.get("profile")) {
                formData.lastUpdatedBy = $.jStorage.get("profile")._id;
                NavigationService.apiCall("Rule/changeAllValues", formData, function (data) {
                    // $scope.data1 = data.data;
                    // $scope.generateField = true;
                    if (data.value == true) {
                        toastr.success("All Rules Updated Successfully", {
                            "closeButton": true,
                            "debug": false,
                            "newestOnTop": false,
                            "progressBar": true,
                            "positionClass": "toast-top-center",
                            "preventDuplicates": false,
                            "onclick": null,
                            "timeOut": "2000",
                            "extendedTimeOut": "1000",
                            "tapToDismiss": false
                        });
                    } else {
                        toastr.error("Failed To Update Rules", {
                            "closeButton": true,
                            "debug": false,
                            "newestOnTop": false,
                            "progressBar": true,
                            "positionClass": "toast-top-center",
                            "preventDuplicates": false,
                            "onclick": null,
                            "timeOut": "2000",
                            "extendedTimeOut": "1000",
                            "tapToDismiss": false
                        });
                    }
                    // console.log("returned data changeAllValuesModalSubmit", data);
                });
                $scope.changeAllValues.close();
                $state.reload();
            } else {
                console.log("Formdata", formData);
                state.go("login");
            }

        }
        $scope.copyClick = function () {
            console.log("copyClick clicked");
            $scope.copied = "Copied";
        }
        $scope.changePage = function (page) {
            var goTo = "page";
            if ($scope.search.keyword) {
                goTo = "page";
            }
            $state.go(goTo, {
                id: $stateParams.id,
                page: page,
                keyword: $scope.search.keyword
            });
        };

        $scope.getAllItems = function (keywordChange) {
            console.log("inside getAllItems", keywordChange);
            $scope.totalItems = undefined;
            if (keywordChange) {
                $scope.currentPage = 1;
            }
            var filters = _.cloneDeep($scope.search);
            delete filters.keyword;

            NavigationService.search($scope.json.json.apiCall.url, {
                    page: $scope.currentPage,
                    keyword: $scope.search.keyword,
                    filter: filters
                }, ++i,
                function (data, ini) {


                    $scope.allSelectedRules = [];
                    $scope.allSelectedActiveRules = [];
                    $scope.allActiveRulesCount = 0;
                    $scope.allInactiveRulesCount = 0;
                    $scope.allProcessingRulesCount = 0;

                    //variables for marketing rules

                    $scope.allSelectedMarketingRules = [];
                    $scope.allSelectedActiveMarketingRules = [];
                    $scope.allActiveMarketingRulesCount = 0;
                    $scope.allInactiveMarketingRulesCount = 0;
                    $scope.allProcessingMarketingRulesCount = 0;



                    if (ini == i) {
                        $scope.items = data.data.results;
                        if ($scope.json.json.tableHeaderOnce == true) {
                            $scope.items[0].tableHeaderForRule = true;
                        }
                        console.log("data after search", data.data);
                        if ($scope.json.json.colorExpired == true) {
                            console.log("right");
                            _.forEach($scope.items, function (value) {


                                var today = new Date();
                                var dd = today.getDate();
                                var mm = today.getMonth() + 1; //January is 0!
                                var yyyy = today.getFullYear();
                                formattedAngularDate = dd + '/' + mm + '/' + yyyy;

                                var arrStartDate = formattedAngularDate.split("/");
                                var date1 = new Date(arrStartDate[2], arrStartDate[1], arrStartDate[0]);

                                // formattedAngularDate = dd + '/' + mm + '/' + yyyy; //dd/mm/yyyy

                                var mongoDate = value.validTo;
                                var mongoDateToDate = new Date(mongoDate);
                                var dd1 = mongoDateToDate.getUTCDate();
                                var mm1 = mongoDateToDate.getUTCMonth() + 1;
                                var yyyy1 = mongoDateToDate.getUTCFullYear();
                                formattedmongoDbDate = dd1 + '/' + mm1 + '/' + yyyy1;

                                var arrEndDate = formattedmongoDbDate.split("/");
                                var date2 = new Date(arrEndDate[2], arrEndDate[1], arrEndDate[0]);


                                var mongoDateFrom = value.validFrom;
                                var mongoDateToDateFrom = new Date(mongoDateFrom);
                                var dd1 = mongoDateToDateFrom.getUTCDate();
                                var mm1 = mongoDateToDateFrom.getUTCMonth() + 1;
                                var yyyy1 = mongoDateToDateFrom.getUTCFullYear();
                                formattedmongoDbDateFrom = dd1 + '/' + mm1 + '/' + yyyy1;

                                var arrFromDate = formattedmongoDbDateFrom.split("/");
                                var date3 = new Date(arrFromDate[2], arrFromDate[1], arrFromDate[0]);
                                // formattedmongoDbDate = dd1 + '/' + mm1 + '/' + yyyy1;

                                // console.log("Both 1) Angular-", date1, " 2) Mongo-", date2);

                                if (date1 > date2) {
                                    value.color = "red";
                                    value.active = true;
                                    $scope.allInactiveRulesCount = $scope.allInactiveRulesCount + 1;
                                    $scope.allSelectedRules.push(value._id);
                                    // console.log("name-",value.name," color-",value.color);
                                } else if (date1 <= date2 && date1 >= date3) {
                                    value.color = "green";
                                    $scope.allActiveRulesCount = $scope.allActiveRulesCount + 1;
                                    value.active = true;
                                    $scope.allSelectedRules.push(value._id);
                                    $scope.allSelectedActiveRules.push(value._id);
                                    // console.log("name-",value.name," color-",value.color);
                                } else {
                                    value.color = "yellow";
                                    $scope.allProcessingRulesCount = $scope.allProcessingRulesCount + 1;
                                    value.active = false;
                                }

                                // console.log(value);
                                // var today = new Date();
                                // var dd = today.getDate();
                                // var mm = today.getMonth() + 1; //January is 0!
                                // var yyyy = today.getFullYear();
                                // formattedAngularDate = dd + '/' + mm + '/' + yyyy; //dd/mm/yyyy
                                // // formattedAngularDate=new Date(formattedAngularDate);
                                // // console.log("angularDate-",formattedAngularDate);

                                // var mongoDate = value.validTo;
                                // var mongoDateToDate = new Date(mongoDate);
                                // var dd1 = mongoDateToDate.getUTCDate();
                                // var mm1 = mongoDateToDate.getUTCMonth() + 1;
                                // var yyyy1 = mongoDateToDate.getUTCFullYear();
                                // // console.log("MongoDate-",dd1+'/'+mm1+'/'+yyyy1);
                                // formattedmongoDbDate = dd1 + '/' + mm1 + '/' + yyyy1;
                                // // formattedmongoDbDate=new Date(formattedmongoDbDate);
                                // console.log("Both 1) Angular-", formattedAngularDate, " 2) Mongo-", formattedmongoDbDate);

                                // if (formattedAngularDate > formattedmongoDbDate) {
                                //     value.color = "red";
                                //     // console.log("name-",value.name," color-",value.color);
                                // } else {
                                //     value.color = "green";
                                //     // console.log("name-",value.name," color-",value.color);
                                // }
                                // var today= new Date();
                                // console.log(new Date(),"today");
                                // console.log("db date-",value.validTo," new date date-".today)
                                // var today=new Date();
                                // if(value.validTo)
                            });
                        }
                        if ($scope.json.json.colorExpiredMarketingRule == true) {
                            console.log("right");
                            _.forEach($scope.items, function (value) {


                                var today = new Date();
                                var dd = today.getDate();
                                var mm = today.getMonth() + 1; //January is 0!
                                var yyyy = today.getFullYear();
                                formattedAngularDate = dd + '/' + mm + '/' + yyyy;

                                var arrStartDate = formattedAngularDate.split("/");
                                var date1 = new Date(arrStartDate[2], arrStartDate[1], arrStartDate[0]);

                                // formattedAngularDate = dd + '/' + mm + '/' + yyyy; //dd/mm/yyyy

                                var mongoDate = value.lastDate;
                                var mongoDateToDate = new Date(mongoDate);
                                var dd1 = mongoDateToDate.getUTCDate();
                                var mm1 = mongoDateToDate.getUTCMonth() + 1;
                                var yyyy1 = mongoDateToDate.getUTCFullYear();
                                formattedmongoDbDate = dd1 + '/' + mm1 + '/' + yyyy1;

                                var arrEndDate = formattedmongoDbDate.split("/");
                                var date2 = new Date(arrEndDate[2], arrEndDate[1], arrEndDate[0]);


                                var mongoDateFrom = value.firstDate;
                                var mongoDateToDateFrom = new Date(mongoDateFrom);
                                var dd1 = mongoDateToDateFrom.getUTCDate();
                                var mm1 = mongoDateToDateFrom.getUTCMonth() + 1;
                                var yyyy1 = mongoDateToDateFrom.getUTCFullYear();
                                formattedmongoDbDateFrom = dd1 + '/' + mm1 + '/' + yyyy1;

                                var arrFromDate = formattedmongoDbDateFrom.split("/");
                                var date3 = new Date(arrFromDate[2], arrFromDate[1], arrFromDate[0]);
                                // formattedmongoDbDate = dd1 + '/' + mm1 + '/' + yyyy1;

                                // console.log("Both 1) Angular-", date1, " 2) Mongo-", date2);

                                if (date1 > date2) {
                                    value.color = "red";
                                    value.active = true;
                                    $scope.allInactiveMarketingRulesCount = $scope.allInactiveMarketingRulesCount + 1;
                                    $scope.allSelectedMarketingRules.push(value._id);
                                    // console.log("name-",value.name," color-",value.color);
                                } else if (date1 <= date2 && date1 >= date3) {
                                    value.color = "green";
                                    $scope.allActiveMarketingRulesCount = $scope.allActiveMarketingRulesCount + 1;
                                    value.active = true;
                                    $scope.allSelectedMarketingRules.push(value._id);
                                    $scope.allSelectedActiveMarketingRules.push(value._id);
                                    // console.log("name-",value.name," color-",value.color);
                                } else {
                                    value.color = "yellow";
                                    $scope.allProcessingMarketingRulesCount = $scope.allProcessingMarketingRulesCount + 1;
                                    value.active = false;
                                }

                            });
                        }
                        $scope.totalItems = data.data.total;
                        console.log("$scope.items[0]", $scope.items[0]);
                        $scope.maxRow = data.data.options.count;
                    }
                });
        };
        JsonService.refreshView = $scope.getAllItems;
        $scope.getAllItems();

    })

    .controller('DetailCtrl', function ($scope, TemplateService, NavigationService, JsonService, $timeout, $state, $stateParams, toastr, $uibModal) {
        $scope.json = JsonService;
        JsonService.setKeyword($stateParams.keyword);
        $scope.template = TemplateService;
        $scope.data = {};
        console.log("detail controller");
        console.log("$scope.json", $scope.json);

        $scope.hideFirstTransaction = function (operatorValue) {
            console.log("hideFirstTransaction and operator is", operatorValue);
        }

        //for view File Format in performance start

        $scope.viewFileFormat = function () {
            console.log("file");
            $scope.viewFileFormatModal = $uibModal.open({
                animation: true,
                templateUrl: 'views/modal/viewFileFormatModal.html',
                size: 'lg',
                scope: $scope
            });
        }


        //for view File Format in performance end
        console.log("roles of page", $scope.json.json.roles);
        if ($scope.json.json.roles) {
            console.log($scope.json.json.roles);
            if ($.jStorage.get("profile")) {
                var accessLevel = $.jStorage.get("profile").accessLevel;
                if ($scope.json.json.roles.includes(accessLevel)) {
                    console.log("you have access");

                    // return true;
                } else {
                    // return false;
                    console.log("current state", $state.current);
                    console.log("you have no access");
                    toastr.error("You Have No Access To " + $scope.json.json.title + " Page");
                    $state.go("dashboard");
                }
            }
        }

        // if($scope.data.operator){
        //     $scope.data.operator = $scope.data.operator.push({
        //         _id: "",
        //         name: "Select Operator"
        //     });
        // }
        if ($scope.json.json.pageType == 'create' && $scope.json.json.title == 'Create Rule') {
            console.log("right");
            $scope.data.status = [{
                _id: "5a2e38f14c61b12642887f0e",
                name: "SUCCESS"
            }, {
                _id: "5a2e38d14c61b12642887f0a",
                name: "DISPUTE_RESOLVED"
            }, {
                _id: "5a2e38a54c61b12642887f06",
                name: "AWAITED_ON_CUSTOMER"
            }, {
                _id: "5a2e38da4c61b12642887f0b",
                name: "DOCUMENTS_AWAITED"
            }, {
                _id: "5a2e38c94c61b12642887f09",
                name: "DISPUTE_INITIATED"
            }];
            $scope.data.transactionType = [{
                _id: "5a2e3a8c821c722c2eb33e87",
                name: "SALE"
            }, {
                _id: "5a2e3ab0821c722c2eb33e8b",
                name: "VERIFICATION_TXN"
            }];
            $scope.data.processingStartDate = "";
            $scope.data.processingEndDate = "";
            $scope.data.relativeTransactionDate = "";
            $scope.data.relativeTransactionEndDate = "";
        }

        //  START FOR EDIT
        if ($scope.json.json.preApi) {
            var obj = {};
            obj[$scope.json.json.preApi.params] = $scope.json.keyword._id;
            NavigationService.apiCall($scope.json.json.preApi.url, obj, function (data) {
                $scope.data = data.data;
                console.log("preapi Data", $scope.data);
                $scope.generateField = true;

            });
        } else {
            $scope.generateField = true;
        }
        //  END FOR EDIT

        $scope.onCancel = function (sendTo) {
            $scope.json.json.action[1].stateName.json.keyword = "";
            $scope.json.json.action[1].stateName.json.page = "";
            $state.go($scope.json.json.action[1].stateName.page, $scope.json.json.action[1].stateName.json);
        };

        $scope.saveData = function (formData) {
            console.log("formData on save", formData);
            // NavigationService.apiCall($scope.json.json.apiCall.url, formData, function (data) {
            // });

            //for rule on one field make others to zero
            console.log("perUser", formData.perUser, " nthPerUserTransaction", formData.nthPerUserTransaction, " nthPerUserTransactionOffer", formData.nthPerUserTransactionOffer, " perUserTransactionOffer", formData.perUserTransactionOffer);
            if ($scope.json.json.apiCall.url == "Rule/save") {
                console.log("hide what u want to hide in this section for rule");
                // if(formData.perUser=="" || formData.perUser==null){
                //     console.log("perUser is Blank",formData.perUser);
                //     formData.perUser=0;
                // }
                // if(formData.nthPerUserTransaction=="" || formData.nthPerUserTransaction==null){
                //     console.log("nthPerUserTransaction is blank");
                //     formData.nthPerUserTransaction=0;
                // }
                // if(formData.nthPerUserTransactionOffer || formData.nthPerUserTransactionOffer==null){
                //     console.log("nthPerUserTransactionOffer is blank");
                //     formData.nthPerUserTransactionOffer=0;
                // }
                // if(formData.perUserTransactionOffer || formData.perUserTransactionOffer==null){
                //     console.log("perUserTransactionOffer is blank");
                //     formData.perUserTransactionOffer=0;
                // }
            }


            if ($.jStorage.get("profile")) {
                console.log("inside jstorage", $.jStorage.get("profile"));
                var currentLoggedInUser = $.jStorage.get("profile")._id;
                // formData.createdBy=$.jStorage.get("profile")._id;

                if (!formData.createdBy) {
                    formData.createdBy = currentLoggedInUser;
                } else {
                    delete formData.createdBy;

                }
            } else {
                state.go("login");
            }
            if ($scope.json.json.createFromEdit == true) {
                delete formData._id;
                delete formData.createdAt;
                delete formData.updatedAt;
                // delete formData.lastUpdatedBy;
                formData.createdBy = $.jStorage.get("profile")._id;
                // formData.lastUpdatedBy = $.jStorage.get("profile")._id;
                console.log("formData after Deletion of _Id,createdAt and updatedAtAt", formData);
            }
            delete formData.createdAt;

            if ($scope.json.keyword._id) {
                if ($scope.json.json.createFromEdit == true) {
                    delete formData.lastUpdatedBy;
                } else {
                    formData.lastUpdatedBy = currentLoggedInUser;
                }

            }

            NavigationService.apiCall($scope.json.json.apiCall.url, formData, function (data) {
                var messText = "created";
                if (data.value === true) {
                    $scope.json.json.action[0].stateName.json.keyword = "";
                    $scope.json.json.action[0].stateName.json.page = "";
                    $scope.json.json.action[0].stateName.json.passingId = "idGosehere";
                    $state.go($scope.json.json.action[0].stateName.page, $scope.json.json.action[0].stateName.json);
                    if ($scope.json.keyword._id) {
                        messText = "edited";
                    }
                    // toastr.options.closeButton = true;
                    // toastr.options.timeOut = 30;
                    // toastr.options.closeButton = true;
                    toastr.success($scope.json.json.name + " " + formData.name + " " + messText + " successfully.", {
                        "closeButton": true,
                        "debug": false,
                        "newestOnTop": false,
                        "progressBar": true,
                        "positionClass": "toast-top-center",
                        "preventDuplicates": false,
                        "onclick": null,
                        "timeOut": "10000",
                        "extendedTimeOut": "1000",
                        "tapToDismiss": false
                    });
                } else {
                    messText = "creating";
                    if ($scope.json.keyword._id) {
                        messText = "editing";
                    }
                    toastr.error("Failed " + messText + " " + $scope.json.json.name);
                }
            });
        };
    })

    .controller('copyRuleCtrl', function ($scope, TemplateService, NavigationService, JsonService, $timeout, $state, $stateParams, toastr) {
        $scope.json = JsonService;
        $scope.template = TemplateService.changecontent("copyRule");
        $scope.menutitle = NavigationService.makeactive("Dashboard");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        JsonService.setKeyword($stateParams.keyword);
        $scope.template = TemplateService;
        $scope.data = {};
        console.log("copyRuleCtrl controller");
        console.log($scope.json);
        console.log("stateParams", $stateParams);

        //  START FOR EDIT
        if ($stateParams) {
            var obj = {
                "_id": $stateParams.id
            };
            // obj[$scope.json.json.preApi.params] = $scope.json.keyword._id;
            NavigationService.apiCall("Rule/getOne", obj, function (data) {
                $scope.data = data.data;
                $scope.generateField = true;
                console.log("$scope.data", $scope.data);
            });
        } else {
            $scope.generateField = true;
        }
        //  END FOR EDIT

        // $scope.onCancel = function (sendTo) {
        //     $scope.json.json.action[1].stateName.json.keyword = "";
        //     $scope.json.json.action[1].stateName.json.page = "";
        //     $state.go($scope.json.json.action[1].stateName.page, $scope.json.json.action[1].stateName.json);
        // };

        // $scope.saveData = function (formData) {
        //     console.log("formData on save",formData);
        //     NavigationService.apiCall($scope.json.json.apiCall.url, formData, function (data) {
        //     });
        // NavigationService.apiCall($scope.json.json.apiCall.url, formData, function (data) {
        //     var messText = "created";
        //     if (data.value === true) {
        //         $scope.json.json.action[0].stateName.json.keyword = "";
        //         $scope.json.json.action[0].stateName.json.page = "";
        //         $state.go($scope.json.json.action[0].stateName.page, $scope.json.json.action[0].stateName.json);
        //         if ($scope.json.keyword._id) {
        //             messText = "edited";
        //         }
        //         toastr.success($scope.json.json.name + " " + formData.name + " " + messText + " successfully.");
        //     } else {
        //         messText = "creating";
        //         if ($scope.json.keyword._id) {
        //             messText = "editing";
        //         }
        //         toastr.error("Failed " + messText + " " + $scope.json.json.name);
        //     }
        // });
        // };
    })

    .controller('DetailFieldCtrl', function ($scope, TemplateService, NavigationService, JsonService, $timeout, $state, $stateParams, $uibModal, toastr) {
        if (!$scope.type.type) {
            $scope.type.type = "text";
        }
        $scope.json = JsonService;
        $scope.tags = {};
        $scope.model = [];
        $scope.tagNgModel = {};
        // $scope.boxModel
        if ($scope.type.validation) {
            var isRequired = _.findIndex($scope.type.validation, function (n) {
                return n == "required";
            });
            if (isRequired >= 0) {
                $scope.type.required = true;
            }
        }
        $scope.form = {};
        if ($scope.value && $scope.value[$scope.type.tableRef]) {
            $scope.form.model = $scope.value[$scope.type.tableRef];
        }

        $scope.template = "views/field/" + $scope.type.type + ".html";

        // Multiple checkbox selection
        if ($scope.type.type == "multipleCheckbox") {
            if ($scope.type.url !== "") {
                NavigationService.searchCall($scope.type.url, {
                    keyword: ""
                }, 1, function (data1) {
                    $scope.items[$scope.type.tableRef] = data1.data.results;
                    if ($scope.json.keyword._id) {
                        console.log("Edit multiCheckbox formData: ", $scope.formData[$scope.type.tableRef]);
                        for (var idx = 0; idx < $scope.items[$scope.type.tableRef].length; idx++) {
                            for (var formIdx = 0; formIdx < $scope.formData[$scope.type.tableRef].length; formIdx++) {
                                if ($scope.items[$scope.type.tableRef][idx]._id == $scope.formData[$scope.type.tableRef][formIdx]._id) {
                                    $scope.items[$scope.type.tableRef][idx].checked = true;
                                }
                            }
                        }
                    }
                });
            } else {
                $scope.items[$scope.type.tableRef] = $scope.type.dropDown;
            }
        }

        // Set multiple checkbox field
        $scope.setSelectedboxItem = function (item) {
            if (typeof $scope.formData[$scope.type.tableRef] === 'undefined')
                $scope.formData[$scope.type.tableRef] = [];
            var index = _.findIndex($scope.formData[$scope.type.tableRef], function (doc) {
                return doc._id == item._id;
            });
            if (index < 0) {
                $scope.formData[$scope.type.tableRef].push({
                    _id: item._id
                });
            } else {
                $scope.formData[$scope.type.tableRef].splice(index, 1);
            }
        };

        function getJsonFromUrl(string) {
            var obj = _.split(string, '?');
            var returnval = {};
            if (obj.length >= 2) {
                obj = _.split(obj[1], '&');
                _.each(obj, function (n) {
                    var newn = _.split(n, "=");
                    returnval[newn[0]] = newn[1];
                    return;
                });
                return returnval;
            }

        }
        // // BOX
        // if ($scope.type.type == "date") {
        //     $scope.formData[$scope.type.tableRef] = moment($scope.formData[$scope.type.tableRef]).toDate();
        // }
        // if ($scope.type.type == "password") {
        //     $scope.formData[$scope.type.tableRef] = "";
        // }
        // if ($scope.type.type == "youtube") {
        //     $scope.youtube = {};
        //     $scope.changeYoutubeUrl = function (string) {
        //         if (string) {
        //             $scope.formData[$scope.type.tableRef] = "";
        //             var result = getJsonFromUrl(string);
        //             if (result && result.v) {
        //                 $scope.formData[$scope.type.tableRef] = result.v;
        //             } else {
        //                 $scope.formData[$scope.type.tableRef] = string;
        //             }
        //         }

        //     };
        // }
        // if ($scope.type.type == "box") {

        //     if (!_.isArray($scope.formData[$scope.type.tableRef]) && $scope.formData[$scope.type.tableRef] === '') {
        //         $scope.formData[$scope.type.tableRef] = [];
        //         $scope.model = [];
        //     } else {
        //         if ($scope.formData[$scope.type.tableRef]) {
        //             $scope.model = $scope.formData[$scope.type.tableRef];
        //         }
        //     }
        //     $scope.search = {
        //         text: ""
        //     };
        // }
        // $scope.state = "";
        // $scope.createBox = function (state) {
        //     $scope.state = state;
        //     $scope.model.push({});
        //     $scope.editBox("Create", $scope.model[$scope.model.length - 1]);
        // };
        // $scope.editBox = function (state, data) {
        //     $scope.state = state;
        //     $scope.data = data;
        //     var modalInstance = $uibModal.open({
        //         animation: $scope.animationsEnabled,
        //         templateUrl: 'views/modal/modal.html',
        //         size: 'lg',
        //         scope: $scope
        //     });
        //     $scope.close = function (value) {
        //         callback(value);
        //         modalInstance.close("cancel");
        //     };
        // };
        // $scope.deleteBox = function (index, data) {
        //     console.log(data);
        //     data.splice(index, 1);
        // };

        // BOX
        if ($scope.type.type == "date") {
            $scope.formData[$scope.type.tableRef] = moment($scope.formData[$scope.type.tableRef]).toDate();
        }
        if ($scope.type.type == "password") {
            $scope.formData[$scope.type.tableRef] = "";
        }
        if ($scope.type.type == "youtube") {
            $scope.youtube = {};
            $scope.changeYoutubeUrl = function (string) {
                if (string) {
                    $scope.formData[$scope.type.tableRef] = "";
                    var result = getJsonFromUrl(string);
                    if (result && result.v) {
                        $scope.formData[$scope.type.tableRef] = result.v;
                    } else {
                        $scope.formData[$scope.type.tableRef] = string;
                    }
                }

            };
        }

        if ($scope.type.type == "box") {

            if (!_.isArray($scope.formData[$scope.type.tableRef]) && $scope.formData[$scope.type.tableRef] === '') {
                $scope.formData[$scope.type.tableRef] = [];
                $scope.model = [];
            } else {
                if ($scope.formData[$scope.type.tableRef]) {
                    $scope.model = $scope.formData[$scope.type.tableRef];
                }
            }
            $scope.search = {
                text: ""
            };
        }
        $scope.state = "";
        $scope.createBox = function (state) {
            $scope.state = state;
            $scope.model.push({});
            $scope.editBox("Create", $scope.model[$scope.model.length - 1]);
        };
        $scope.editBox = function (state, data) {
            $scope.state = state;
            $scope.data = data;
            if (!$scope.formData[$scope.type.tableRef]) {
                $scope.formData[$scope.type.tableRef] = []
            }

            if (state == 'Create' && $scope.json.json.pageType=="create") {
                $scope.formData[$scope.type.tableRef].push(data);
            }

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'views/modal/modal.html',
                size: 'lg',
                scope: $scope
            });
            $scope.close = function (value) {
                callback(value);
                modalInstance.close("cancel");
            };
        };
        $scope.deleteBox = function (index, data) {
            console.log(data);
            data.splice(index, 1);
        };


        if ($scope.type.type == "boxEditable") {
            
                        if (!_.isArray($scope.formData[$scope.type.tableRef]) && $scope.formData[$scope.type.tableRef] === '') {
                            $scope.formData[$scope.type.tableRef] = [];
                            $scope.model = [];
                        } else {
                            if ($scope.formData[$scope.type.tableRef]) {
                                $scope.model = $scope.formData[$scope.type.tableRef];
                            }
                        }
                        $scope.search = {
                            text: ""
                        };
                    }
                    $scope.state = "";
                    $scope.createBoxEditable = function (state) {
                        $scope.state = state;
                        $scope.model.push({});
                        $scope.editBoxEditable("Create", $scope.model[$scope.model.length - 1]);
                    };
                    $scope.editBoxEditable = function (state, data) {
                        console.log("testttttt");
                        $scope.state = state;
                        $scope.data = data;
                        if (!$scope.formData[$scope.type.tableRef]) {
                            $scope.formData[$scope.type.tableRef] = []
                        }
            
                        if (state == 'Create' && $scope.json.json.pageType=="create") {
                            $scope.formData[$scope.type.tableRef].push(data);
                        }
            
                        // var modalInstance = $uibModal.open({
                        //     animation: $scope.animationsEnabled,
                        //     templateUrl: 'views/modal/modal.html',
                        //     size: 'lg',
                        //     scope: $scope
                        // });
                        $scope.close = function (value) {
                            callback(value);
                            modalInstance.close("cancel");
                        };
                    };
                    $scope.deleteBox = function (index, data) {
                        console.log(data);
                        data.splice(index, 1);
                    };
            
            
        //avi box start
        // if ($scope.type.type == "box") {
        //     console.log("inside $scope.type.type == box");
        //     if (!_.isArray($scope.formData[$scope.type.tableRef]) && $scope.formData[$scope.type.tableRef] === '') {
        //         console.log("inside if");
        //         $scope.formData[$scope.type.tableRef] = [];
        //         $scope.model = [];
        //     } else {
        //         if ($scope.formData[$scope.type.tableRef]) {
        //             // console.log("inside elseif");
        //             $scope.model = $scope.formData[$scope.type.tableRef];
        //             console.log("on initialization $scope.model", $scope.model);
        //         }
        //     }
        //     $scope.search = {
        //         text: ""
        //     };
        // }
        // $scope.state = "";
        // $scope.createBox = function (state) {
        //     $scope.state = state;
        //     var emptyObject = {};

        //     console.log("$scope.model in createbox before push",$scope.model);
        //     $scope.model.push({});
        //     console.log("$scope.model in createbox after push",$scope.model);
        //     console.log("*********",$scope.model[$scope.model.length - 2],"&",$scope.model[$scope.model.length - 1]);
        //     if($scope.model[$scope.model.length - 1]==$scope.model[$scope.model.length - 2]){
        //         console.log("in pop");
        //         $scope.model.pop();
        //     }
        //     console.log("after processing $scope.model",$scope.model);
        //     console.log("$scope.model",$scope.model);
        //     if (_.isEmpty($scope.model)) {
        //         console.log("$scope.model empty block", $scope.model);
        //         $scope.model.push({});
        //         console.log("$scope.model[$scope.model.length - 1]",$scope.model[$scope.model.length - 1]);
        //         $scope.editBox("Create", $scope.model[$scope.model.length - 1]);
        //     } else {
        //         console.log("$scope.model not empty block", $scope.model);
        //         $scope.editBox("Create", {});
        //     }


        //     // console.log("$scope.model in createbox before push",$scope.model);
        //     // $scope.model.push({});
        //     // console.log("$scope.model in createbox after push",$scope.model);
        //     // console.log("*********",$scope.model[$scope.model.length - 2],"&",$scope.model[$scope.model.length - 1]);
        //     // if($scope.model[$scope.model.length - 1]==$scope.model[$scope.model.length - 2]){
        //     //     console.log("in pop");
        //     //     $scope.model.pop();
        //     // }
        //     // console.log("after processing $scope.model",$scope.model);
        //     // $scope.editBox("Create", $scope.model[$scope.model.length - 1]);
        //     // $scope.editBox("Create", {});

        //     // $scope.editBox("Create", $scope.model);
        // };
        // $scope.editBox = function (state, data) {
        //     $scope.state = state;

        //     $scope.data = data;
        //     console.log("$scope.data in box controller", $scope.data);
        //     console.log("$scope.formData[$scope.type.tableRef]",$scope.formData[$scope.type.tableRef]);
        //     if (!$scope.formData[$scope.type.tableRef]) {
        //         $scope.formData[$scope.type.tableRef] = []
        //     }

        //     if (state == 'Create') {
        //         console.log("$scope.formData[$scope.type.tableRef]",$scope.formData[$scope.type.tableRef],"------ data-",data);
        //         $scope.formData[$scope.type.tableRef].push(data);
        //         console.log("where state is create in box", $scope.formData[$scope.type.tableRef]);
        //     }

        //     var modalInstance = $uibModal.open({
        //         animation: $scope.animationsEnabled,
        //         templateUrl: 'views/modal/modal.html',
        //         size: 'lg',
        //         scope: $scope
        //     });
        //     $scope.close = function (value) {
        //         callback(value);
        //         modalInstance.close("cancel");
        //     };
        // };
        // $scope.deleteBox = function (index, data) {
        //     console.log(data);
        //     data.splice(index, 1);
        // };
        //avi box end
        $scope.clearBoxLastElement = function (data) {
            console.log(data);
            console.log("--------", $scope.formData[$scope.type.tableRef]);
            $scope.formData[$scope.type.tableRef].pop();
            // data.splice(index, 1);
        };

        $scope.thirtyMinuteInterval = ["00:00", "00:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30", "04:00", "04:30", "05:00", "05:30"]

        //  TAGS STATIC AND FROM TABLE
        $scope.refreshTags = function (search) {
            if ($scope.type.url !== "") {
                NavigationService.searchCall($scope.type.url, {
                    keyword: search
                }, 1, function (data1) {
                    $scope.tags[$scope.type.tableRef] = data1.data.results;
                });
            } else {
                $scope.tags[$scope.type.tableRef] = $scope.type.dropDown;
            }
        };
        if ($scope.type.type == "tags") {
            $scope.refreshTags();
        }

        if ($scope.type.type == "tags1") {
            $scope.type.dropDown = [];
            for (var i = 0; i < 24; i = i + 1) {
                if (i <= 9) {
                    var value = '0' + i;
                } else {
                    var value = i;
                }
                $scope.type.dropDown.push(value + ":00");
                $scope.type.dropDown.push(value + ":30");
            }
            // console.log("xxxxxxxx",$scope.type.dropDown);
            // $scope.thirtyMinuteInterval=["00:00","00:30","01:00","01:30","02:00","02:30","03:00","03:30","04:00","04:30","05:00","05:30","06:00","06:30","07:00"]
            // // $scope.tags[$scope.type.tableRef] = $scope.thirtyMinuteInterval;
            // $scope.type.dropDown=$scope.thirtyMinuteInterval;
        }

        $scope.tagClicked = function (select, index) {
            if ($scope.type.fieldType === "array") {
                $scope.formData[$scope.type.tableRef] = [];
                _.each(select, function (n) {
                    $scope.formData[$scope.type.tableRef].push(n._id);
                });
            } else {
                $scope.formData[$scope.type.tableRef] = select;
            }
        };
    })

    .controller('LoginCtrl', function ($scope, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
        //Used to name the .html file
        $scope.menutitle = NavigationService.makeactive("Login");
        $scope.menutitle = NavigationService.makeactive("Login");
        TemplateService.title = $scope.menutitle;
        $scope.template = TemplateService;
        $scope.currentHost = window.location.origin;

        if ($.jStorage.get("accessToken")) {
            $state.go("dashboard");
        } else {
            console.log("AccessController else");
            $state.go("login");
        }
        $scope.loginError = null;
        $scope.login = function (formData) {
            // console.log("login", formData);
            NavigationService.apiCall("User/login", formData, function (data) {
                if (data.value === true) {
                    $scope.profileDetails = data.data;
                    NavigationService.parseAccessToken(data.data._id, function () {
                        NavigationService.profile(function () {
                            $scope.template.profile = data.data;
                            console.log("before redirect dashboard", $scope.template.profile);
                            $state.go("dashboard");
                        }, function () {
                            console.log("before redirect login");
                            $state.go("login");
                        });
                    });
                    console.log("profileDetails found successfully", $scope.profileDetails);
                } else {
                    $scope.loginError = data.error.message;
                    // console.log("false");
                    //  toastr.warning('Error submitting the form', 'Please try again');
                }
            });
        }


        // if ($stateParams.id) {
        //     if ($stateParams.id === "AccessNotAvailable") {
        //         toastr.error("You do not have access for the Backend.");
        //     } else {
        //         NavigationService.parseAccessToken($stateParams.id, function () {
        //             NavigationService.profile(function () {
        //                 $state.go("dashboard");
        //             }, function () {
        //                 $state.go("login");
        //             });
        //         });
        //     }
        // } else {
        //     NavigationService.removeAccessToken();
        // }

    })

    .controller('CountryCtrl', function ($scope, TemplateService, NavigationService, $timeout, $state, $stateParams, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("country-list");
        $scope.menutitle = NavigationService.makeactive("Country List");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.currentPage = $stateParams.page;
        var i = 0;
        $scope.search = {
            keyword: ""
        };
        if ($stateParams.keyword) {
            $scope.search.keyword = $stateParams.keyword;
        }
        $scope.showAllCountries = function (keywordChange) {
            $scope.totalItems = undefined;
            if (keywordChange) {
                $scope.currentPage = 1;
            }
            NavigationService.searchCountry({
                page: $scope.currentPage,
                keyword: $scope.search.keyword
            }, ++i, function (data, ini) {
                if (ini == i) {
                    $scope.countries = data.data.results;
                    $scope.totalItems = data.data.total;
                    $scope.maxRow = data.data.options.count;
                }
            });
        };

        $scope.changePage = function (page) {
            var goTo = "country-list";
            if ($scope.search.keyword) {
                goTo = "country-list";
            }
            $state.go(goTo, {
                page: page,
                keyword: $scope.search.keyword
            });
        };
        $scope.showAllCountries();
        $scope.deleteCountry = function (id) {
            globalfunction.confDel(function (value) {
                console.log(value);
                if (value) {
                    NavigationService.deleteCountry(id, function (data) {
                        if (data.value) {
                            $scope.showAllCountries();
                            toastr.success("Country deleted successfully.", "Country deleted");
                        } else {
                            toastr.error("There was an error while deleting country", "Country deleting error");
                        }
                    });
                }
            });
        };
    })

    .controller('CreateCountryCtrl', function ($scope, TemplateService, NavigationService, $timeout, $state, toastr) {
        //Used to name the .html file

        $scope.template = TemplateService.changecontent("country-detail");
        $scope.menutitle = NavigationService.makeactive("Country");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.header = {
            "name": "Create Country"
        };
        $scope.formData = {};
        $scope.saveCountry = function (formData) {
            console.log($scope.formData);
            NavigationService.countrySave($scope.formData, function (data) {
                if (data.value === true) {
                    $state.go('country-list');
                    toastr.success("Country " + formData.name + " created successfully.", "Country Created");
                } else {
                    toastr.error("Country creation failed.", "Country creation error");
                }
            });
        };

    })

    .controller('CreateAssignmentCtrl', function ($scope, TemplateService, NavigationService, $timeout, $state, toastr, $stateParams, $uibModal) {
        //Used to name the .html file

        $scope.template = TemplateService.changecontent("assignment-detail");
        $scope.menutitle = NavigationService.makeactive("Assignment");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.header = {
            "name": "Create Assignment"
        };
        $scope.formData = {};
        $scope.formData.status = true;
        $scope.formData.invoice = [];
        $scope.formData.products = [];
        $scope.formData.LRs = [];
        $scope.formData.vehicleNumber = [];
        $scope.formData.others = [];
        $scope.formData.shareWith = [];
        $scope.modalData = {};
        $scope.modalIndex = "";
        $scope.wholeObj = [];
        $scope.addModels = function (dataArray, data) {
            dataArray.push(data);
        };

        // NavigationService.searchNatureLoss(function(data) {
        //     $scope.natureLoss = data.data.results;
        // });

        $scope.refreshShareWith = function (data, office) {
            var formdata = {};
            formdata.search = data;
            formdata.filter = {
                "postedAt": office
            };
            NavigationService.searchEmployee(formdata, 1, function (data) {
                $scope.shareWith = data.data.results;
            });
        };
        $scope.refreshNature = function (data, causeloss) {
            var formdata = {};
            formdata.search = data;
            formdata.filter = {
                "_id": causeloss
            };
            NavigationService.getNatureLoss(formdata, 1, function (data) {
                $scope.natureLoss = data.data.results;
            });
        };

        $scope.addModal = function (filename, index, holdobj, data, current, wholeObj) {
            if (index !== "") {
                $scope.modalData = data;
                $scope.modalIndex = index;
            } else {
                $scope.modalData = {};
                $scope.modalIndex = "";
            }
            $scope.wholeObj = wholeObj;
            $scope.current = current;
            $scope.holdObject = holdobj;
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: 'views/modal/' + filename + '.html',
                size: 'lg'
            });
        };

        $scope.addElements = function (moddata) {
            if ($scope.modalIndex !== "") {
                $scope.wholeObj[$scope.modalIndex] = moddata;
            } else {
                $scope.newjson = moddata;
                var a = moddata;
                switch ($scope.holdObject) {
                    case "invoice":
                        {
                            var newmod = a.invoiceNumber.split(',');
                            _.each(newmod, function (n) {
                                $scope.newjson.invoiceNumber = n;
                                $scope.wholeObj.push($scope.newjson);
                            });
                        }
                        break;
                    case "products":
                        {
                            var newmod1 = a.item.split(',');
                            _.each(newmod1, function (n) {
                                $scope.newjson.item = n;
                                $scope.wholeObj.push($scope.newjson);
                            });
                        }
                        break;
                    case "LRs":
                        var newmod2 = a.lrNumber.split(',');
                        _.each(newmod2, function (n) {
                            $scope.newjson.lrNumber = n;
                            $scope.wholeObj.push($scope.newjson);
                        });
                        break;
                    case "Vehicle":
                        var newmod3 = a.vehicleNumber.split(',');
                        _.each(newmod3, function (n) {
                            $scope.newjson.vehicleNumber = n;
                            $scope.wholeObj.push($scope.newjson);
                        });
                        break;

                    default:
                        {
                            $scope.wholeObj.push($scope.newjson);
                        }

                }

            }
        };

        $scope.deleteElements = function (index, data) {
            data.splice(index, 1);
        };


        $scope.submit = function (formData) {
            console.log($scope.formData);
            NavigationService.assignmentSave($scope.formData, function (data) {
                if (data.value === true) {
                    $state.go('assignment-list');
                    toastr.success("Assignment " + formData.name + " created successfully.", "Assignment Created");
                } else {
                    toastr.error("Assignment creation failed.", "Assignment creation error");
                }
            });
        };

    })

    .controller('EditAssignmentCtrl', function ($scope, TemplateService, NavigationService, $timeout, $state, toastr, $stateParams, $uibModal) {
        //Used to name the .html file

        $scope.template = TemplateService.changecontent("assignment-detail");
        $scope.menutitle = NavigationService.makeactive("Assignment");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.header = {
            "name": "Edit Assignment"
        };
        $scope.formData = {};
        $scope.formData.status = true;
        $scope.formData.invoice = [];
        $scope.formData.products = [];
        $scope.formData.LRs = [];
        $scope.formData.vehicleNumber = [];
        $scope.formData.others = [];
        $scope.formData.shareWith = [];
        $scope.modalData = {};
        $scope.modalIndex = "";
        $scope.wholeObj = [];
        $scope.addModels = function (dataArray, data) {
            dataArray.push(data);
        };

        NavigationService.getOneModel("Assignment", $stateParams.id, function (data) {
            $scope.formData = data.data;
            $scope.formData.dateOfIntimation = new Date(data.data.dateOfIntimation);
            $scope.formData.dateOfAppointment = new Date(data.data.dateOfAppointment);
            $scope.formData.country = data.data.city.district.state.zone.country._id;
            $scope.formData.zone = data.data.city.district.state.zone._id;
            $scope.formData.state = data.data.city.district.state._id;
            $scope.formData.district = data.data.city.district._id;
            $scope.formData.city = data.data.city._id;
            $scope.formData.insuredOfficer = data.data.insuredOfficer._id;
            console.log($scope.formData.policyDoc);
            console.log($scope.formData);
        });


        $scope.refreshShareWith = function (data, office) {
            var formdata = {};
            formdata.search = data;
            formdata.filter = {
                "postedAt": office
            };
            NavigationService.searchEmployee(formdata, 1, function (data) {
                $scope.shareWith = data.data.results;
            });
        };
        $scope.refreshNature = function (data, causeloss) {
            var formdata = {};
            formdata.search = data;
            formdata.filter = {
                "_id": causeloss
            };
            NavigationService.getNatureLoss(formdata, 1, function (data) {
                $scope.natureLoss = data.data.results;
            });
        };

        $scope.addModal = function (filename, index, holdobj, data, current, wholeObj) {
            if (index !== "") {
                $scope.modalData = data;
                $scope.modalIndex = index;
            } else {
                $scope.modalData = {};
                $scope.modalIndex = "";
            }
            $scope.wholeObj = wholeObj;
            $scope.current = current;
            $scope.holdObject = holdobj;
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: 'views/modal/' + filename + '.html',
                size: 'lg'
            });
        };

        $scope.addElements = function (moddata) {
            if ($scope.modalIndex !== "") {
                $scope.wholeObj[$scope.modalIndex] = moddata;
            } else {
                $scope.newjson = moddata;
                var a = moddata;
                switch ($scope.holdObject) {
                    case "invoice":
                        {
                            var newmod = a.invoiceNumber.split(',');
                            _.each(newmod, function (n) {
                                $scope.newjson.invoiceNumber = n;
                                $scope.wholeObj.push($scope.newjson);
                            });
                        }
                        break;
                    case "products":
                        {
                            var newmod1 = a.item.split(',');
                            _.each(newmod1, function (n) {
                                $scope.newjson.item = n;
                                $scope.wholeObj.push($scope.newjson);
                            });
                        }
                        break;
                    case "LRs":
                        var newmod2 = a.lrNumber.split(',');
                        _.each(newmod2, function (n) {
                            $scope.newjson.lrNumber = n;
                            $scope.wholeObj.push($scope.newjson);
                        });
                        break;
                    case "Vehicle":
                        var newmod3 = a.vehicleNumber.split(',');
                        _.each(newmod3, function (n) {
                            $scope.newjson.vehicleNumber = n;
                            $scope.wholeObj.push($scope.newjson);
                        });
                        break;

                    default:
                        {
                            $scope.wholeObj.push($scope.newjson);
                        }

                }

            }
        };

        $scope.deleteElements = function (index, data) {
            data.splice(index, 1);
        };


        $scope.submit = function (formData) {
            console.log($scope.formData);
            NavigationService.assignmentSave($scope.formData, function (data) {
                if (data.value === true) {
                    $state.go('assignment-list');
                    toastr.success("Assignment " + formData.name + " created successfully.", "Assignment Created");
                } else {
                    toastr.error("Assignment creation failed.", "Assignment creation error");
                }
            });
        };

    })

    .controller('EditCountryCtrl', function ($scope, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
        //Used to name the .html file

        $scope.template = TemplateService.changecontent("country-detail");
        $scope.menutitle = NavigationService.makeactive("Country");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.header = {
            "name": "Edit Country"
        };

        NavigationService.getOneCountry($stateParams.id, function (data) {
            $scope.formData = data.data;
            console.log('$scope.oneCountry', $scope.oneCountry);

        });

        $scope.saveCountry = function (formValid) {
            NavigationService.countryEditSave($scope.formData, function (data) {
                if (data.value === true) {
                    $state.go('country-list');
                    console.log("Check this one");
                    toastr.success("Country " + $scope.formData.name + " edited successfully.", "Country Edited");
                } else {
                    toastr.error("Country edition failed.", "Country editing error");
                }
            });
        };

    })

    .controller('SchemaCreatorCtrl', function ($scope, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("schema-creator");
        $scope.menutitle = NavigationService.makeactive("Schema Creator");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.collectionTypes = ["Table View", "Table View Drag and Drop", "Grid View", "Grid View Drag and Drop"];
        $scope.schema = [{
            "schemaType": "Boolean",
            "Input1": "",
            "Input2": ""
        }, {
            "schemaType": "Color",
            "Input1": "",
            "Input2": ""
        }, {
            "schemaType": "Date",
            "Input1": "",
            "Input2": ""
        }, {
            "schemaType": "Email",
            "Input1": "",
            "Input2": ""
        }, {
            "schemaType": "File",
            "Input1": "MB Limit",
            "Input2": ""
        }, {
            "schemaType": "Image",
            "Input1": "pixel x",
            "Input2": "pixel y "
        }, {
            "schemaType": "Location",
            "Input1": "",
            "Input2": ""
        }, {
            "schemaType": "Mobile",
            "Input1": "",
            "Input2": ""
        }, {
            "schemaType": "Multiple Select",
            "Input1": "Enum",
            "Input2": ""
        }, {
            "schemaType": "Multiple Select From Table",
            "Input1": "Collection",
            "Input2": "Field"
        }, {
            "schemaType": "Number",
            "Input1": "min ",
            "Input2": "max"
        }, {
            "schemaType": "Single Select ",
            "Input1": "Enum",
            "Input2": ""
        }, {
            "schemaType": "Single Select From Table",
            "Input1": "Collection",
            "Input2": "Field"
        }, {
            "schemaType": "Telephone",
            "Input1": "",
            "Input2": ""
        }, {
            "schemaType": "Text",
            "Input1": "min length",
            "Input2": "max length"
        }, {
            "schemaType": "TextArea",
            "Input1": "min length",
            "Input2": "max length"
        }, {
            "schemaType": "URL",
            "Input1": "",
            "Input2": ""
        }, {
            "schemaType": "WYSIWYG",
            "Input1": "",
            "Input2": ""
        }, {
            "schemaType": "Youtube",
            "Input1": "",
            "Input2": ""
        }];


        $scope.inputTypes = [{
            value: '',
            name: 'Select type of input'
        }, {
            value: 'Text',
            name: 'Text'
        }, {
            value: 'Date',
            name: 'Date'
        }, {
            value: 'Textarea',
            name: 'Textarea'
        }];

        $scope.formData = {};
        $scope.formData.status = true;

        $scope.formData.forms = [{
            head: '',
            items: [{}, {}]
        }];

        $scope.addHead = function () {
            $scope.formData.forms.push({
                head: $scope.formData.forms.length + 1,
                items: [{}]
            });
        };
        $scope.removeHead = function (index) {
            if ($scope.formData.forms.length > 1) {
                $scope.formData.forms.splice(index, 1);
            } else {
                $scope.formData.forms = [{
                    head: '',
                    items: [{}, {}]
                }];
            }
        };

        $scope.addItem = function (obj) {
            var index = $scope.formData.forms.indexOf(obj);
            $scope.formData.forms[index].items.push({});
        };

        $scope.removeItem = function (obj, indexItem) {
            var indexHead = $scope.formData.forms.indexOf(obj);
            if ($scope.formData.forms[indexHead].items.length > 1) {
                $scope.formData.forms[indexHead].items.splice(indexItem, 1);
            } else {
                $scope.formData.forms[indexHead].items = [{}];
            }
        };

    })

    .controller('ExcelUploadCtrl', function ($scope, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("excel-upload");
        $scope.menutitle = NavigationService.makeactive("Excel Upload");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.form = {
            file: null,
            model: $stateParams.model
        };

        $scope.excelUploaded = function () {
            console.log("Excel is uploaded with name " + $scope.form.file);
            NavigationService.uploadExcel($scope.form, function (data) {
                $scope.data = data.data;
            });
        };
    })

    .controller('headerctrl', function ($scope, TemplateService, $uibModal, $state) {
        $scope.template = TemplateService;
        $scope.logout = function () {
            console.log("inside header ctrl logout function");
            $.jStorage.deleteKey("profile");
            $.jStorage.deleteKey("accessToken");
            // $state.go("dashboard");
            $state.go("login");
        }
        $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $(window).scrollTop(0);
        });

    })

    .controller('exposureMerchantCategoryCtrl', function ($scope, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("exposureMerchantCategory");
        $scope.menutitle = NavigationService.makeactive("exposureMerchantCategory");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
            NavigationService.apiCall("ExposureMerchantCategory/search",{}, function (data) {
                console.log("inside contest ctrl:", data.data.name);
                $scope.tableData = data.data.results;
                console.log("inside contest ctrl*****:", data.data);
            });
            NavigationService.apiCall("Merchant/search", {}, function (data) {
                $scope.merchants = data.data.results;
                console.log("$scope.merchants", $scope.merchants);
            });

        // $scope.getAllItems = function (month) {
        //     console.log("in getAllItems", month);
        //     var month=1;
        //     NavigationService.apiCall("ExposureMerchantCategory/search", month, function (data) {
        //         console.log("inside contest ctrl:", data.data.name);
        //         $scope.tableData = data.data;
        //         console.log("inside contest ctrl*****:", data.data);
        //     });

        // };


    })

    .controller('languageCtrl', function ($scope, TemplateService, $translate, $rootScope) {

        $scope.changeLanguage = function () {
            console.log("Language CLicked");

            if (!$.jStorage.get("language")) {
                $translate.use("hi");
                $.jStorage.set("language", "hi");
            } else {
                if ($.jStorage.get("language") == "en") {
                    $translate.use("hi");
                    $.jStorage.set("language", "hi");
                } else {
                    $translate.use("en");
                    $.jStorage.set("language", "en");
                }
            }
            //  $rootScope.$apply();
        };
    });