myApp.service('JsonService', function ($http, TemplateService, $state, toastr, $uibModal, NavigationService) {
  this.json = {};
  this.keyword = {};
  // this.refreshView;
  var JsonService = this;
  this.setKeyword = function (data) {
    try {
      this.keyword = JSON.parse(data);
      console.log(this.keyword);
    } catch (e) {
      console.log("keyword is not is json format");
    }
  };
  this.getJson = function (page, callback) {
    $http.get("pageJson/" + page + ".json").then(function (data) {
      data = data.data;
      JsonService.json = data;
      console.log("json service",data);
      switch (data.pageType) {
        case "view":
          {
            TemplateService.changecontent("view");
          }
          break;

        case "create":
          {
            TemplateService.changecontent("detail");
          }
          break;

        case "edit":
          {
            TemplateService.changecontent("detail");
          }
          break;

        case "copy":
        {
          TemplateService.changecontent("detail");
        }
        break;
      }
      callback();
    });

  };
  this.deleteFunction = function (callback) {

    var modalInstance = $uibModal.open({
      // animation: $scope.animationsEnabled,
      templateUrl: '/backend/views/modal/conf-delete.html',
      size: 'sm',
      scope: this
    });
    // this.close = function (value) {
    //   callback(value);
    //   modalInstance.close("cancel");
    // };
  };

  var openCustomModal = function (size, title, message) {
    // var actionToPerformOnConfirm = action;
    console.log("in model");
    var modalInstance = $uibModal.open({
      templateUrl: '/backend/views/modal/conf-delete.html',
      size: "lg",
      resolve: {
        title: title,
        message: message
      }
    });
  };

  this.eventModal = function (value) {
    console.log(value);
  };


  this.eventAction = function (action, value) {
    console.log("value in jsonservice",value," and action",action);
    var sendTo = {
      id: action.action
    };
    console.log("sendToin jsonservice",sendTo);
    console.log(action);
    if (action.type == "box") {
      JsonService.modal = action;
      globalfunction.openModal(function (data) {
        console.log(data);
      });
    } else if (action.type == "redirect") {
      if (action.linkType == "admin") {
        window.location.href = adminurl + action.action;
      } else if (action.linkType == "internal") {
        console.log("inside internal",action.action);
        window.location.href = "#!/" + action.action;
      } else if (action.linkType == "internalWithId") {
        console.log("value",value);
        console.log("#!/" + action.action+"/"+value._id);
        window.location.href = "#!/" + action.action+"/"+value._id;
        // window.location.href = "#!/" + action.action;
      } else {
        window.location.href = action.action;
      }
    } else {
      console.log("outside else before value && action && action.fieldsToSend");
      if (value && action && action.fieldsToSend) {
        console.log("inside else before value && action && action.fieldsToSend");
        var keyword = {};
        _.each(action.fieldsToSend, function (n, key) {
          console.log(n," and key ",key);
          keyword[key] = value[n];
        });
        sendTo.keyword = JSON.stringify(keyword);
        console.log("sendTo.keyword",sendTo.keyword);
      }
      if (action && action.type == "page") {
        console.log("inside page sendTo",sendTo);
        $state.go("page", sendTo);
      } else if (action && action.type == "apiCallConfirm") {
        globalfunction.confDel(function (value2) {
          if (value2) {
            NavigationService.delete(action.api, value, function (data) {
              if (data.value) {
                toastr.success(JsonService.json.title + " deleted successfully.", JsonService.json.title + " deleted");
                JsonService.refreshView();
              } else {
                toastr.error("There was an error while deleting " + JsonService.json.title, JsonService.json.title + " deleting error");
              }
            });
          }
        });
      }
    }
  };





});