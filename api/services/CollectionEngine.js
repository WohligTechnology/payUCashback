var schema = new Schema({
    name: {
        type: String,
        required: true
    },
    outstandingAmount:{
        type:Number
    },
    outstandingAmountOperator: {
        type: Schema.Types.ObjectId,
        ref: 'CollectionOperator'
    },
    outstandingEndAmount:{
        type:Number
    },
    previousRepaymentAmount:{
        type:Number
    },
    previousRepaymentAmountOperator: {
        type: Schema.Types.ObjectId,
        ref: 'CollectionOperator'
    },
    previousRepaymentEndAmount:{
        type:Number
    },
    previousRepaymentMode: [{
        type: Schema.Types.ObjectId,
        ref: 'PreviousRepaymentMode'
    }],
    previousRepaymentDpd:{
        type:Number
    },
    previousRepaymentDpdOperator: {
        type: Schema.Types.ObjectId,
        ref: 'CollectionOperator'
    },
    previousRepaymentEndDpd:{
        type:Number
    },
    dueSince:{
        type:Date
    },
    dueSinceOperator: {
        type: Schema.Types.ObjectId,
        ref: 'CollectionOperator'
    },
    dueSinceEnd:{
        type:Date
    },
    siInfo:{
        type: String,
        enum: ['None', 'Yes', 'No']
    },
    prnDueAmount:{
        type:Number
    },
    prnDueAmountOperator: {
        type: Schema.Types.ObjectId,
        ref: 'CollectionOperator'
    },
    prnDueEndAmount:{
        type:Number
    },
    favourableTimeOfDay: [{
        type: Schema.Types.ObjectId,
        ref: 'FavourableTimeOfDay'
    }],
    favourableDayOfWeek: [{
        type: Schema.Types.ObjectId,
        ref: 'FavourableDayOfWeek'
    }],
    preferredRepaymentChannel:[{
        type: Schema.Types.ObjectId,
        ref: 'PreferredRepaymentChannel'
    }],
    mailerList: {
        type: Schema.Types.ObjectId,
        ref: 'MailerList'
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
                'outstandingAmountOperator': {
                    select: ''
                },
                'previousRepaymentAmountOperator':{
                    select: ''
                },
                'previousRepaymentMode':{
                    select: ''
                },
                'previousRepaymentDpdOperator':{
                    select:''
                },
                'dueSinceOperator':{
                    select:''
                },
                'prnDueAmountOperator':{
                    select:''
                },
                'createdBy': {
                    select: 'name _id email'
                },
                'lastUpdatedBy': {
                    select: 'name _id email'
                },
                'favourableTimeOfDay':{
                    select: ''
                },
                'favourableDayOfWeek':{
                    select: ''
                },
                'preferredRepaymentChannel':{
                    select:''
                },
                'mailerList':{
                    select:''
                }
            }
            });
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('CollectionEngine', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, 'outstandingAmountOperator previousRepaymentAmountOperator previousRepaymentMode previousRepaymentDpdOperator dueSinceOperator prnDueAmountOperator favourableTimeOfDay favourableDayOfWeek preferredRepaymentChannel mailerList createdBy lastUpdatedBy', 'outstandingAmountOperator previousRepaymentAmountOperator previousRepaymentMode previousRepaymentDpdOperator dueSinceOperator prnDueAmountOperator favourableTimeOfDay favourableDayOfWeek preferredRepaymentChannel mailerList createdBy lastUpdatedBy'));
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
        CollectionEngine.find({
                isDeleted: 0
            }).sort({
                createdAt: -1
            })
            .populate('outstandingAmountOperator previousRepaymentAmountOperator previousRepaymentMode previousRepaymentDpdOperator dueSinceOperator prnDueAmountOperator favourableTimeOfDay favourableDayOfWeek preferredRepaymentChannel mailerList createdBy lastUpdatedBy')
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
        console.log("deleteWithChangeStatus CollectionEngine service",data);
        var Const = this(data);
        CollectionEngine.update({
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
        console.log("changeAllValues CollectionEngine service",data);
        var Const = this(data);
        CollectionEngine.update({
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
        CollectionEngine.find({
            isAutomated: "true",
            $and:[{validFrom:{$lte:new Date()}},{validTo:{$gte:new Date()}}],
            isDeleted:0
        }).populate('merchant applicableMerchant status transactionType createdBy lastUpdatedBy').exec(function (err, found) {
            if (err) {
                console.log('**** error at getAllAutomated of CollectionEngine.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, []);
            } else {
                callback(null, found);
            }
        });
    },

    getAllCollectionEngines:function(data,callback){
        console.log("inside getAllCollectionEngines service");
        CollectionEngine.find({
            $and:[{validFrom:{$lte:new Date()}},{validTo:{$gte:new Date()}}],
            isDeleted:0
        }).populate('merchant applicableMerchant status transactionType createdBy lastUpdatedBy').exec(function (err, found) {
            if (err) {
                console.log('**** error at getAllCollectionEngines of CollectionEngine.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, []);
            } else {
                callback(null, found);
            }
        });
    },

    getAllCurrentCollectionEngines:function(data,callback){
        console.log("inside getAllCurrentCollectionEngines service");
        CollectionEngine.find({
            $and:[{validFrom:{$lte:new Date()}},{validTo:{$gte:new Date()}}],
            isDeleted:0
        }).populate('merchant applicableMerchant status transactionType createdBy lastUpdatedBy').exec(function (err, found) {
            if (err) {
                console.log('**** error at getAllCurrentCollectionEngines of CollectionEngine.js ****', err);
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
                        emailData.filename = "playSelectedCollectionEnginesArray.ejs";
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
    AddCollectionEngine: function (data, callback) {
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