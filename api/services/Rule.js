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
    relativeTransactionDate:{
        type:Date
    },
    relativeTransactionEndDate:{
        type:Date
    },
    yesterdayMinusXDays:{
        type:Number,
        default:0
    },
    isAutomated:{
        type: String,
        default: "false",
        enum: ['true', 'false']
    },
    perUser:{
        type:String,
        default:"1"
    },
    generationCriteria:{
        type: String,
        default: "Daily",
        enum: ['Daily', 'After End Date',"After Repayment"]
    },
    applicableMerchant: [{
        type: Schema.Types.ObjectId,
        ref: 'Merchant'
    }],
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
    }],
    isDeleted:{
        type:Number,
        default: 0
    },
    queryId:{
        type:String
    },
    query:{
        type:String
    },
    status:[{
        type: Schema.Types.ObjectId,
        ref: 'Status'
    }],
    transactionType:[{
        type: Schema.Types.ObjectId,
        ref: 'TransactionType'
    }],
    campaignName:{
        type:String
    },
    minimumAccumulatedSpendInNumberOfDays:{
        type:Number
    },
    minimumTransactionAmount:{
        type:Number,
        default: 0
    }
});

schema.plugin(deepPopulate, {
            populate: {
                'merchant': {
                    select: 'name _id merchantSqlId'
                },
                'applicableMerchant':{
                    select: 'name _id merchantSqlId'
                },
                'status':{
                    select: 'name _id'
                },
                'transactionType':{
                    select: 'name _id'
                }
            }
            });
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Rule', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, 'merchant applicableMerchant status transactionType', 'merchant applicableMerchant status transactionType'));
var model = {
    search: function (data, callback) {
        console.log("in custom");
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
        Rule.find({
                isDeleted: 0
            }).sort({
                createdAt: -1
            })
            .populate('merchant applicableMerchant status transactionType')
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
        console.log("deleteWithChangeStatus rule service",data);
        var Const = this(data);
        Rule.update({
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
    getAllAutomated:function(data,callback){
        console.log("inside getAllAutomated service");
        Rule.find({
            isAutomated: "true",
            $and:[{validFrom:{$lte:new Date()}},{validTo:{$gte:new Date()}}],
            isDeleted:0
        }).populate('merchant').exec(function (err, found) {
            if (err) {
                console.log('**** error at getAllAutomated of Rule.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, []);
            } else {
                callback(null, found);
            }
        });
    },

    getAllRules:function(data,callback){
        console.log("inside getAllRules service");
        Rule.find({
            $and:[{validFrom:{$lte:new Date()}},{validTo:{$gte:new Date()}}],
            isDeleted:0
        }).populate('merchant').exec(function (err, found) {
            if (err) {
                console.log('**** error at getAllRules of Rule.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, []);
            } else {
                callback(null, found);
            }
        });
    },

    getAllCurrentRules:function(data,callback){
        console.log("inside getAllCurrentRules service");
        Rule.find({
            $and:[{validFrom:{$lte:new Date()}},{validTo:{$gte:new Date()}}],
            isDeleted:0
        }).populate('merchant').exec(function (err, found) {
            if (err) {
                console.log('**** error at getAllCurrentRules of Rule.js ****', err);
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