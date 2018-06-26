var schema = new Schema({
    name: {
        type: String,
        required: true
    },
    downloadOption:{
        type: String,
        default: "Both",
        enum: ['Email', 'Mobile',"Both"]
    },
    noOfDays: {
        type: Number,
        default: 30,
        enum: [30,180]
    },
    inclusive: [{
        type: Schema.Types.ObjectId,
        ref: 'Flag'
    }],
    exclusive: [{
        type: Schema.Types.ObjectId,
        ref: 'Flag'
    }],
    score:{
        type: String,
        default: "Influence Score",
        enum: ['Influence Score', 'Affleunce Score',"Multiplied Score"]
    },
    merchant: {
        type: Schema.Types.ObjectId,
        ref: 'MarketingMerchant'
    },
    merchantCategory: [{
        type: Schema.Types.ObjectId,
        ref: 'MerchantCategory'
    }],
    dayOfWeek:[{
        type: Schema.Types.ObjectId,
        ref: 'DayOfWeek'
    }],
    paymentMode: [{
        type: Schema.Types.ObjectId,
        ref: 'PaymentMode'
    }],
    bankType: [{
        type: Schema.Types.ObjectId,
        ref: 'Bank'
    }],
    deviceType: [{
        type: Schema.Types.ObjectId,
        ref: 'Device'
    }],
    checkoutType: [{
        type: Schema.Types.ObjectId,
        ref: 'Checkout'
    }],
    timeOfDay: [{
        type: Schema.Types.ObjectId,
        ref: 'TimeOfDay'
    }],
    firstDate:{
        type:Date
    },
    firstTransactionDateOperator: {
        type: Schema.Types.ObjectId,
        ref: 'Operator'
    },
    lastDate:{
        type:Date
    },
    lastTransactionDateOperator: {
        type: Schema.Types.ObjectId,
        ref: 'Operator'
    },
    transactionOperator: {
        type: Schema.Types.ObjectId,
        ref: 'Operator'
    },
    numberOfTransactionStart:{
        type:Number
    },
    numberOfTransaction:{
        type:Number
    },
    amountOperator: {
        type: Schema.Types.ObjectId,
        ref: 'Operator'
    },
    amount: {
        type: Number
    },
    affluenceScore:{
        type:Number
    },
    affluenceScoreOperator: {
        type: Schema.Types.ObjectId,
        ref: 'CollectionOperator'
    },
    affluenceScoreEnd:{
        type:Number
    },
    engagementScore:{
        type:Number
    },
    engagementScoreOperator: {
        type: Schema.Types.ObjectId,
        ref: 'CollectionOperator'
    },
    engagementScoreEnd:{
        type:Number
    },
    digitalRiskScore:{
        type:Number
    },
    digitalRiskScoreOperator: {
        type: Schema.Types.ObjectId,
        ref: 'CollectionOperator'
    },
    digitalRiskScoreEnd:{
        type:Number
    },
    isDeleted:{
        type:Number,
        default: 0
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
                'merchant': {
                    select: 'name _id'
                },
                'inclusive':{
                    select: 'name _id'
                },
                'exclusive':{
                    select: 'name _id'
                },
                'merchantCategory':{
                    select:'_id name'
                },
                'dayOfWeek':{
                    select:'_id name'
                },
                'paymentMode':{
                    select:'_id name'
                },
                'bankType':{
                    select:'_id name'
                },
                'deviceType':{
                    select:'_id name'
                },
                'checkoutType':{
                    select:'_id name'
                },
                'timeOfDay':{
                    select:'_id name'
                },
                'transactionOperator':{
                    select:'_id name'
                },
                'amountOperator':{
                    select:'_id name'
                },
                'affluenceScoreOperator':{
                    select:''
                },
                'engagementScoreOperator':{
                    select:''
                },
                'digitalRiskScoreOperator':{
                    select:''
                },
                'firstTransactionDateOperator':{
                    select:'_id name'
                },
                'lastTransactionDateOperator':{
                    select:'_id name'
                },
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
module.exports = mongoose.model('MarketingRule', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, 'merchant inclusive exclusive merchantCategory dayOfWeek paymentMode bankType deviceType checkoutType timeOfDay transactionOperator amountOperator firstTransactionDateOperator lastTransactionDateOperator affluenceScoreOperator engagementScoreOperator digitalRiskScoreOperator createdBy lastUpdatedBy','merchant inclusive exclusive merchantCategory dayOfWeek paymentMode bankType deviceType checkoutType timeOfDay transactionOperator amountOperator firstTransactionDateOperator lastTransactionDateOperator affluenceScoreOperator engagementScoreOperator digitalRiskScoreOperator createdBy lastUpdatedBy'));
var model = {

    search: function (data, callback) {
        // console.log("in custom");
        var maxRow = Config.maxRow;
        var page = 1;
        if (data.page) {
            page = data.page;
        }
        var field = data.field;
        var options = {
            field: data.field,
            filters: {
                keyword: {
                    fields: ['name'],
                    term: data.keyword
                }
            },
            sort: {
                desc: 'createdAt'
            },
            start: (page - 1) * maxRow,
            count: maxRow
        };
        MarketingRule.find({
                isDeleted: 0
            }).sort({
                createdAt: -1
            })
            .populate('merchant inclusive exclusive merchantCategory dayOfWeek paymentMode bankType deviceType checkoutType timeOfDay transactionOperator amountOperator firstTransactionDateOperator lastTransactionDateOperator affluenceScoreOperator engagementScoreOperator digitalRiskScoreOperator createdBy lastUpdatedBy')
            .order(options)
            .keyword(options)
            .page(options,
                function (err, found) {
                    if (err) {
                        console.log('**** error at merchant of merchant.js ****', err);
                        callback(err, null);
                    } else if (_.isEmpty(found)) {
                        callback(null, []);
                    } else {
                        callback(null, found);
                    }
                });
    },
    deleteWithChangeStatus: function (data, callback) {
        // var Model = this;
        console.log("deleteWithChangeStatus Marketingrule service",data);
        var Const = this(data);
        MarketingRule.update({
            _id: data._id
        },{
            $set:
            {
                isDeleted: 1
            }
        }, function (err, data2) {
            if (err) {
                console.log("in if",err);
                callback(err);
            } else {
                console.log("else");
                callback(null, data2);
            }
        });
    },
    changeAllValues: function (data, callback) {
        // var Model = this;
        console.log("changeAllValues Marketingrule service",data);
        var Const = this(data);
        MarketingRule.update({
            isDeleted:0
        },{
            $set:
            {
                yesterdayMinusXDays: data.value,
                lastUpdatedBy:data.lastUpdatedBy
            }
        },{multi: true}, function (err, data2) {
            if (err) {
                console.log("in if",err);
                callback(err);
            } else {
                console.log("else");
                callback(null, data2);
            }
        });
    },
    getAllAutomated:function(data,callback){
        console.log("inside getAllAutomated service");
        MarketingRule.find({
            isAutomated: "true",
            $and:[{validFrom:{$lte:new Date()}},{validTo:{$gte:new Date()}}],
            isDeleted:0
        }).populate('merchant applicableMerchant status transactionType createdBy lastUpdatedBy').exec(function (err, found) {
            if (err) {
                console.log('**** error at getAllAutomated of MarketingRule.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, []);
            } else {
                callback(null, found);
            }
        });
    },

    getAllMarketingRules:function(data,callback){
        console.log("inside getAllMarketingRules service");
        MarketingRule.find({
            $and:[{validFrom:{$lte:new Date()}},{validTo:{$gte:new Date()}}],
            isDeleted:0
        }).populate('merchant applicableMerchant status transactionType createdBy lastUpdatedBy').exec(function (err, found) {
            if (err) {
                console.log('**** error at getAllMarketingRules of MarketingRule.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, []);
            } else {
                callback(null, found);
            }
        });
    },

    getAllCurrentMarketingRules:function(data,callback){
        console.log("inside getAllCurrentMarketingRules service");
        MarketingRule.find({
            $and:[{validFrom:{$lte:new Date()}},{validTo:{$gte:new Date()}}],
            isDeleted:0
        }).populate('merchant applicableMerchant status transactionType createdBy lastUpdatedBy').exec(function (err, found) {
            if (err) {
                console.log('**** error at getAllCurrentMarketingRules of MarketingRule.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, []);
            } else {
                callback(null, found);
            }
        });
    },

    playSelectedEmail: function (data, callback) {
        console.log("inside playSelectedEmail service data",data);
                        var emailData = {};
                        var total = 0;
                        emailData.email = "avinash.ghare@wohlig.com";
                        emailData.subject = "Play Selected Array Email";
                        emailData.filename = "playSelectedMarketingRulesArray.ejs";
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
    AddMarketingRule: function (data, callback) {
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