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
    minimumAccumulatedSpend: {
        type: Number
    },
    maximumCashback: {
        type: Number
    },
    promoCode: {
        type: String
    },
    isFirstTransaction: {
        type: String,
        default: "true",
        enum: ['true', 'false']
    },
    validFrom: {
        type: Date
    },
    validTo: {
        type: Date
    },
    processingStartDate: {
        type: Date
    },
    processingEndDate: {
        type: Date
    },
    relativeTransactionDate: {
        type: Date
    },
    relativeTransactionEndDate: {
        type: Date
    },
    yesterdayMinusXDays: {
        type: Number,
        default: 0
    },
    isAutomated: {
        type: String,
        default: "false",
        enum: ['true', 'false']
    },
    perUser: {
        type: String,
        default: "1"
    },
    perUserTransactionOffer: {
        type: String,
        default: "0"
    },
    nthPerUserTransaction: {
        type: String,
        default: "0"
    },
    nthPerUserTransactionOffer: {
        type: String,
        default: "0"
    },
    generationCriteria: {
        type: String,
        default: "Daily",
        enum: ['Daily', 'After End Date', "After Repayment"]
    },
    applicableMerchant: [{
        type: Schema.Types.ObjectId,
        ref: 'Merchant'
    }],
    applicableProduct: {
        type: String
    },
    giftCard: [{
        transaction: {
            type: String
        },
        cashbackDetails: {
            type: String
        }
    }],
    isDeleted: {
        type: Number,
        default: 0
    },
    queryId: {
        type: String
    },
    query: {
        type: String
    },
    status: [{
        type: Schema.Types.ObjectId,
        ref: 'Status'
    }],
    transactionType: [{
        type: Schema.Types.ObjectId,
        ref: 'TransactionType'
    }],
    campaignName: {
        type: String
    },
    minimumAccumulatedSpendInNumberOfDays: {
        type: Number
    },
    minimumTransactionAmount: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    lastUpdatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    excludeStartDate: {
        type: Date
    },
    excludeEndDate: {
        type: Date
    }
});

schema.plugin(deepPopulate, {
    populate: {
        'merchant': {
            select: 'name _id merchantSqlId'
        },
        'applicableMerchant': {
            select: 'name _id merchantSqlId'
        },
        'status': {
            select: 'name _id'
        },
        'transactionType': {
            select: 'name _id'
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
module.exports = mongoose.model('Rule', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, 'merchant applicableMerchant status transactionType createdBy lastUpdatedBy', 'merchant applicableMerchant status transactionType createdBy lastUpdatedBy'));
var model = {

    search: function (data, callback) {
        console.log("inside new search");
        var Model = this;
        var Const = this(data);
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
                asc: 'createdAt'
            },
            start: (page - 1) * maxRow,
            count: maxRow
        };

        console.log("options", options.filters.keyword);

        // var aggregatePipeline = [
        //     // Stage 1
        //     {
        //         $match: {
        //             "isDeleted": 0,
        //             $text: { 
        //                 $search: data.keyword
        //             }
        //         }

        //     }
        // ];
        var aggregatePipeline = [
            // Stage 1
            {
                $lookup: {
                    "from": "merchants",
                    "localField": "merchant",
                    "foreignField": "_id",
                    "as": "merchant"
                }
            }, {
                $unwind: '$merchant'
            }
        ];

        // Stage 2
        aggregatePipeline.push({
            $lookup: {
                "from": "merchants",
                "localField": "applicableMerchant",
                "foreignField": "_id",
                "as": "applicableMerchant"
            }
        });

        // Stage 3
        aggregatePipeline.push({
            $lookup: {
                "from": "status",
                "localField": "status",
                "foreignField": "_id",
                "as": "status"
            }
        });

        // Stage 4
        aggregatePipeline.push({
            $lookup: {
                "from": "transactiontypes",
                "localField": "transactionType",
                "foreignField": "_id",
                "as": "transactionType"
            }
        });

        // Stage 5
        aggregatePipeline.push({
            $lookup: {
                "from": "users",
                "localField": "createdBy",
                "foreignField": "_id",
                "as": "createdBy"
            }
        });

        // Stage 6
        aggregatePipeline.push({
            $lookup: {
                "from": "users",
                "localField": "lastUpdatedBy",
                "foreignField": "_id",
                "as": "lastUpdatedBy"
            }
        });

        // Stage 7
        var merchant = {};

        if (data.filter.merchant) {
            merchant = {
                "merchant._id": ObjectId(data.filter.merchant)
            }
        }
        var startDate = {};

        if (data.filter.startDate) {
            startDate = {
                "validFrom": {
                    $gte: new Date(data.filter.startDate)
                }
            }
        }
        var endDate = {};

        if (data.filter.endDate) {
            endDate = {
                "validTo": {
                    $lte: new Date(data.filter.endDate)
                }
            }
        }
        // var fixedObject1 = {
        //     "merchant.name": {
        //         $regex: data.keyword,
        //         $options: "i"
        //     }
        // }
        var fixedObject3 = {
            "name": {
                $regex: data.keyword,
                $options: "i"
            }
        }
        var fixedObject1 = {
            $or: [{
                "name": {
                    $regex: data.keyword,
                    $options: "i"
                }
            },{
                "merchant.name":{
                    $regex: data.keyword,
                    $options: "i"
                }
            }]
        }
        var fixedObject2 = {
            "isDeleted": 0
        }

        var aggMatch = Object.assign(fixedObject2,startDate,endDate,merchant,fixedObject1);

        aggregatePipeline.push({
                    $match: aggMatch
                });
                console.log("ABC",aggMatch);
        // Stage 2


        //     aggregatePipeline.push({
        //         $match: {
        //             "merchant._id" : ObjectId(data.filter.merchant),
        //             "isDeleted":0,
        //             "validFrom":{$gte: new Date(data.filter.startDate) },
        //             "validTo":{$lte: new Date(data.filter.endDate) },
        //             "name":{
        //                             $regex: data.keyword,
        //                             $options: "i"
        //                             }
        //         }
        //     });
        //     console.log(aggregatePipeline);
        // } else{
        //     console.log("else");
        //     aggregatePipeline.push({
        //         $match: {
        //             "isDeleted": 0
        //         }
        //     });
        // }
        // if (data.keyword != "") {
        //     aggregatePipeline.push({
        //         $match: {
        //             "name": {
        //             $regex: data.keyword,
        //             $options: "i"
        //             }
        //             }
        //     });
        // }

        //     aggregatePipeline.push({
        //         $match: {
        //             "isDeleted": 0
        //         }
        //     });
        // } else {

        //     aggregatePipeline.push({
        //         $match: {
        //             "isDeleted": 0
        //         }
        //     });
        // }

        //Stage 8
        aggregatePipeline.push({
            $sort: {
                validTo: -1,
                validFrom: -1
            }
        });

        async.parallel({
            options: function (callback) {
                callback(null, options);
            },
            results: function (callback) {
                Rule.aggregate(
                    // Pipeline
                    _.concat(aggregatePipeline, [

                        // Stage 3
                        {
                            $skip: options.start
                        },

                        // Stage 4
                        {
                            $limit: maxRow

                        },
                    ])).exec(callback);

            },
            total: function (callback) {
                Rule.aggregate(
                    // Pipeline
                    _.concat(aggregatePipeline, [
                        // Stage 3
                        {
                            $group: {
                                "_id": "_id",
                                "count": {
                                    $sum: 1
                                }
                            }
                        }
                    ])).exec(function (err, data) {
                    if (err || _.isEmpty(data)) {
                        callback(err, 0);
                    } else {
                        callback(null, data[0].count);
                    }
                });
            }
        }, function (err, data2) {
            if (err) {
                console.log("in if", err);
                callback(err);
            } else {
                callback(null, data2);
            }
        });

    },


    search1: function (data, callback) {
        console.log("in custom", data);
        var maxRow = Config.maxRow;
        var page = 1;
        if (data.page) {
            page = data.page;
        }
        var field = data.field;
        // var conditionParameters={};
        // if (data.keyword.filter.merchant) {
        if (_.isEmpty(data.filter)) {
            console.log("if");
            var conditionParameters = {
                isDeleted: 0
            };
        } else {
            console.log("else");
            if (data.filter.merchant) {

                var conditionParameters = {
                    isDeleted: 0,
                    merchant: data.filter.merchant
                };
                // var conditionParameters = {
                //     isDeleted: 0,
                //     merchant: data.filter.merchant,
                //     startDate: {
                //         $gte: data.filter.startDate
                //     }
                // };
            }
        }
        var options = {
            field: data.field,
            filters: {
                keyword: {
                    fields: ['name'],
                    term: data.keyword
                }
            },
            sort: {
                desc: 'validFrom'
            },
            start: (page - 1) * maxRow,
            count: maxRow
        };
        Rule.find(conditionParameters).sort({
                validTo: -1
            })
            .populate('merchant applicableMerchant status transactionType createdBy lastUpdatedBy')
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
                        // var newResultArray=[];
                        // _.forEach(found.results, function(value,key) {
                        //     var merchantName=value.merchant.name+" "+value.name;
                        //     console.log(merchantName);
                        //     var res=merchantName.match(/faa/g);
                        //     console.log("response-",res,"-");
                        //     if(res==null){
                        //     }else{
                        //         newResultArray.push(value);
                        //     }
                        //     // console.log(key,"-",value);

                        //   });
                        //   found.results=newResultArray;
                        //   console.log(found);
                        callback(null, found);
                    }
                });
    },
    deleteWithChangeStatus: function (data, callback) {
        // var Model = this;
        console.log("deleteWithChangeStatus rule service", data);
        var Const = this(data);
        Rule.update({
            _id: data._id
        }, {
            $set: {
                isDeleted: 1,
                isAutomated: "false"
            }
        }, function (err, data2) {
            if (err) {
                console.log("in if", err);
                callback(err);
            } else {
                console.log("else");
                callback(null, data2);
            }
        });
    },
    changeAllValues: function (data, callback) {
        // var Model = this;
        console.log("changeAllValues rule service", data);
        var Const = this(data);
        Rule.update({
            isDeleted: 0
        }, {
            $set: {
                yesterdayMinusXDays: data.value,
                lastUpdatedBy: data.lastUpdatedBy
            }
        }, {
            multi: true
        }, function (err, data2) {
            if (err) {
                console.log("in if", err);
                callback(err);
            } else {
                console.log("else");
                callback(null, data2);
            }
        });
    },
    getAllAutomated: function (data, callback) {
        console.log("inside getAllAutomated service");
        Rule.find({
            isAutomated: "true",
            $and: [{
                validFrom: {
                    $lte: new Date()
                }
            }, {
                validTo: {
                    $gte: new Date()
                }
            }],
            isDeleted: 0
        }).populate('merchant applicableMerchant status transactionType createdBy lastUpdatedBy').exec(function (err, found) {
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

    getAllRules: function (data, callback) {
        console.log("inside getAllRules service");
        Rule.find({
            $and: [{
                validFrom: {
                    $lte: new Date()
                }
            }, {
                validTo: {
                    $gte: new Date()
                }
            }],
            isDeleted: 0
        }).populate('merchant applicableMerchant status transactionType createdBy lastUpdatedBy').exec(function (err, found) {
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

    getAllCurrentRules: function (data, callback) {
        console.log("inside getAllCurrentRules service");
        Rule.find({
            $and: [{
                validFrom: {
                    $lte: new Date()
                }
            }, {
                validTo: {
                    $gte: new Date()
                }
            }],
            isDeleted: 0
        }).populate('merchant applicableMerchant status transactionType createdBy lastUpdatedBy').exec(function (err, found) {
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
        console.log("inside playSelectedEmail service data", data);
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
                sendData.response = response;
                sendData.message = "successfull";
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