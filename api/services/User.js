var md5 = require('md5');
var schema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        validate: validators.isEmail(),
        unique: true
    },
    password: {
        type: String,
        default: ""
    },
    mobile: {
        type: String,
        default: ""
    },
    accessToken: {
        type: [String],
        index: true
    },
    accessLevel: {
        type: String,
        default: "User",
        enum: ['User', 'Admin', 'Super Admin']
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    lastUpdatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

schema.plugin(deepPopulate, {
    populate: {
        'createdBy': {
            select: 'name _id email'
        },
        'lastUpdatedBy': {
            select: 'name _id email'
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);

module.exports = mongoose.model('User', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "createdBy", "lastUpdatedBy"));
var model = {
    doLogin: function (data, callback) {
        console.log("data", data)
        User.findOne({
            email: data.email,
            password: md5(data.password)
        }).exec(function (err, found) {
            if (err) {

                callback(err, null);
            } else {
                if (found) {
                    var foundObj = found.toObject();
                    delete foundObj.password;
                    callback(null, foundObj);
                } else {
                    callback({
                        message: "Incorrect Credentials!"
                    }, null);
                }
            }

        });
    },
    saveData: function (data, callback) {
        // console.log("**********");
        var Model = this;
        // console.log("outside and before data.password",data._id);
        // if(_.isEmpty(data.password)){
        //     console.log("hascbjabschhjsca");
        // }
        if(_.isEmpty(data.password)){
            // console.log("##############");
            if(data._id){
                if(_.isEmpty(data.password)){
                    // console.log("inside *****");
                    delete data.password;
                    // console.log("after delete",data);
                } else{
                    // console.log("wrong else");
                }
            } else{
                // console.log("inside data.password before md5",data.password);
                data.password=md5(data.password);
                // console.log("data.password after md5",data.password);
                data.accessToken=[uid(16)];
                // console.log("data.accessToken",data.accessToken);
            }
        } else{
            // console.log("inside data.password before md5",data.password);
            data.password=md5(data.password);
            // console.log("data.password after md5",data.password);
            data.accessToken=[uid(16)];
            // console.log("data.accessToken",data.accessToken);
        }
        var Const = this(data);
        var foreignKeys = Config.getForeignKeys(schema);

        
        if (data._id) {
            
            Model.findOne({
                _id: data._id
            }, function (err, data2) {
                if (err) {
                    callback(err, data2);
                } else if (data2) {
                    async.each(foreignKeys, function (n, callback) {
                        if (data[n.name] != data2[n.name]) {
                            Config.manageArrayObject(mongoose.models[n.ref], data2[n.name], data2._id, n.key, "delete", function (err, md) {
                                if (err) {
                                    callback(err, md);
                                } else {
                                    Config.manageArrayObject(mongoose.models[n.ref], data[n.name], data2._id, n.key, "create", callback);
                                }
                            });
                        } else {
                            callback(null, "no found for ");
                        }
                    }, function (err) {
                        data2.update(data, {
                            w: 1
                        }, callback);
                    });


                } else {
                    callback("No Data Found", data2);
                }
            });
        } else {

            Const.save(function (err, data2) {
                if (err) {
                    callback(err, data2);
                } else {

                    async.each(foreignKeys, function (n, callback) {
                        Config.manageArrayObject(mongoose.models[n.ref], data2[n.name], data2._id, n.key, "create", function (err, md) {
                            callback(err, data2);
                        });
                    }, function (err) {
                        callback(err, data2);
                    });

                }
            });

        }

    },

     existsSocial: function (user, callback) {
        var Model = this;
        var userEmail = '';
        Model.findOne({
        
            "oauthLogin.socialId": user.id,
            "oauthLogin.socialProvider": user.provider,
        }).exec(function (err, data) {
            if (err) {
                callback(err, data);
            } else if (_.isEmpty(data)) {
                if (user.emails && user.emails.length > 0) {
                    userEmail = user.emails[0].value;
                 
                }
                Model.findOne({'email':userEmail},function(err,userData){
                             if(err){
                            console.log(err);
                             }
                          if(_.isEmpty(userData)){
                            var modelUser = {
                                name: user.displayName,
                                email: userEmail,
                                accessToken: [uid(16)],
                                loginProvider:user.provider,
                                oauthLogin: [{
                                    socialId: user.id,
                                    socialProvider: user.provider,
                                }]
                            };
                            
                            modelUser.socialAccessToken = user.AccessToken;
                            modelUser.socialRefreshToken = user.RefreshToken;
                            if (user.image && user.image.url) {
                                modelUser.photo = user.image.url;
                            }
                            Model.saveData(modelUser, function (err, data2) {
                                if (err) {
                                    callback(err, data2);
                                } else {
                                    data3 = data2.toObject();
                                    delete data3.oauthLogin;
                                    delete data3.password;
                                    delete data3.forgotPassword;
                                    delete data3.otp;
                                    callback(err, data3);
                                }
                            });
                          }else{
                              console.log(userData.oauthLogin);
                            userData.oauthLogin.push({socialId:user.id, socialProvider: user.provider});
                            userData.loginProvider = user.provider;
                            userData.socialAccessToken = user.AccessToken;
                            userData.socialRefreshToken = user.RefreshToken;
                            userData.save(function(err, savedData){
                                delete savedData.oauthLogin;
                                delete savedData.password;
                                delete savedData.forgotPassword;
                                delete savedData.otp;
                                callback(err,savedData);
                            });
                          }   
                });

                
            } else {
                delete data.oauthLogin;
                delete data.password;
                delete data.forgotPassword;
                delete data.otp;

                console.log(" ============ user.googleAccessToken",user.AccessToken);
                data.loginProvider = user.provider;
                data.socialAccessToken = user.AccessToken;
                data.save(function () {});
                callback(err, data);
            }
        });
    },
    profile: function (data, callback, getGoogle) {
        var str = "name email photo mobile accessLevel loginProvider";
        if (getGoogle) {
            str += " googleAccessToken googleRefreshToken";
        }
        User.findOne({
            accessToken: data.accessToken
        }, str).exec(function (err, data) {
            if (err) {
                callback(err);
            } else if (data) {
                callback(null, data);
            } else {
                callback("No Data Found", data);
            }
        });
    },
    updateAccessToken: function (id, accessToken) {
        User.findOne({
            "_id": id
        }).exec(function (err, data) {
            data.googleAccessToken = accessToken;
            data.save(function () {});
        });
    },
    /**
     * This function get all the media from the id.
     * @param {userId} data
     * @param {callback} callback
     * @returns  that number, plus one.
     */
    getAllMedia: function (data, callback) {

    }
};
module.exports = _.assign(module.exports, exports, model);