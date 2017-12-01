var schema = new Schema({
    name: {
        type: String,
        required: true
    },
    merchant: {
        type: Schema.Types.ObjectId,
        ref: 'Merchant'
    },
    percentage: {
        type: Number
    },
    amount: {
        type: Number
    },
    minimumAccumulatedSpend:{
        type:Number
    },
    maximumCashback: {
        type: Number
    },
    promoCode: {
        type: String
    },
    isFirstTransaction:{
        type: String,
        default: "true",
        enum: ['true', 'false']
    },
    validFrom:{
        type:Date
    },
    validTo:{
        type:Date
    },
    processingStartDate:{
        type:Date
    },
    processingEndDate:{
        type:Date
    },
    perUser:{
        type:Number
    },
    generationCriteria:{
        type: String,
        default: "Daily",
        enum: ['Daily', 'After End Date',"After Repayment"]
    },
    applicableMerchant:{
        type:String
    },
    applicableProduct:{
        type:String
    },
    giftCard:[{
        transaction:{
            type: String
        },
        cashbackDetails: {
            type: String
        }
    }]
});

schema.plugin(deepPopulate, {
            populate: {
                'merchant': {
                    select: 'name _id'
                }
            }
            });
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Rule', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, 'merchant', 'merchant'));
var model = {

    playSelectedEmail: function (data, callback) {
        console.log("inside playSelectedEmail service data",data);
                        var emailData = {};
                        var total = 0;
                        emailData.email = "avinash.ghare@wohlig.com";
                        emailData.subject = "Play Selected Array Email";
                        emailData.filename = "playSelectedRulesArray.ejs";
                        emailData.from = "avinashghare572@gmail.com";
                        emailData.selectedArray = data;
                        Config.playSelectedEmail(emailData, function (err, response) {
                            if (err) {
                                console.log("error in email", err);
                                callback("emailError", null);
                            } else if (response) {
                                var sendData = {};
                                sendData.response=response;
                                sendData.message="successfull";
                                // sendData._id = created._id;
                                // sendData.email = created.email;
                                // sendData.accessToken = created.accessToken;
                                // sendData.firstName = created.firstName;
                                // sendData.lastName = created.lastName;
                                callback(null, sendData);
                            } else {
                                callback("errorOccurredRegister", null);
                            }
                        });
                    
    },
    AddRule: function (data, callback) {
                var Model = this;
                var voteData = data.body;
                voteData.userAgentDetails = JSON.stringify(data.headers);
                Model.saveData(voteData, function (err, data2) {
                    if (err) {
                        callback(err, data2);
                    } else {
                        Awardcategory.findOne({
                            "_id": data.body.awardcategory
                        }).exec(function (err, awardcategoryData) {
                            //console.log(data);
                            _.each(awardcategoryData.company, function (value) {
                                console.log(value);
                                console.log(data.body.company);
                                if (value.companyObj == data.body.company) {
                                    console.log(data.body.company);
                                    console.log("MatchFound");
                                    value.voteCount = ++value.voteCount;
                                }
                            });
                            awardcategoryData.save(function (err, data) {
                                callback(err, data);
                            });
                        });
                    }
                });
            }
};
module.exports = _.assign(module.exports, exports, model);