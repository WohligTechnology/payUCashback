var schema = new Schema({
    name: {
        type: String,
        required: true,
        excel: true,
    },
    email: {
        type: String,
        validate: validators.isEmail(),
        excel: "User Email",
        unique: true
    },
    dob: {
        type: Date,
        excel: {
            name: "Birthday",
            modify: function (val, data) {
                return moment(val).format("MMM DD YYYY");
            }
        }
    },
    photo: {
        type: String,
        default: "",
        excel: [{
            name: "Photo Val"
        }, {
            name: "Photo String",
            modify: function (val, data) {
                return "http://abc/" + val;
            }
        }, {
            name: "Photo Kebab",
            modify: function (val, data) {
                return data.name + " " + moment(data.dob).format("MMM DD YYYY");
            }
        }]
    },
    password: {
        type: String,
        default: ""
    },
    forgotPassword: {
        type: String,
        default: ""
    },
    mobile: {
        type: String,
        default: ""
    },
    otp: {
        type: String,
        default: ""
    },
    accessToken: {
        type: [String],
        index: true
    },
    googleAccessToken: String,
    googleRefreshToken: String,
    oauthLogin: {
        type: [{
            socialId: String,
            socialProvider: String
        }],
        index: true
    },
    accessLevel: {
        type: String,
        default: "User",
        enum: ['User', 'Admin']
    },
    loginProvider:String
});

schema.plugin(deepPopulate, {
    populate: {
        'user': {
            select: 'name _id'
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);

module.exports = mongoose.model('User', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "user", "user"));
var model = {
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