var schema = new Schema({
    name: {
        type: String,
        unique: true
    },
    exposureMerchant: [{
        type: Schema.Types.ObjectId,
        ref: 'ExposureMerchant'
    }],
    oneHourAmount: {
        type: Number
    },
    oneHourPercentage: {
        type: Number
    },
    oneHourMailerList: {
        type: Schema.Types.ObjectId,
        ref: 'MailerList'
    },
    threeHourAmount: {
        type: Number
    },
    threeHourPercentage: {
        type: Number
    },
    threeHourMailerList: {
        type: Schema.Types.ObjectId,
        ref: 'MailerList'
    },
    sixHourAmount: {
        type: Number
    },
    sixHourPercentage: {
        type: Number
    },
    sixHourMailerList: {
        type: Schema.Types.ObjectId,
        ref: 'MailerList'
    },
    twelveHourAmount: {
        type: Number
    },
    twelveHourPercentage: {
        type: Number
    },
    twelveHourMailerList: {
        type: Schema.Types.ObjectId,
        ref: 'MailerList'
    },
    dailyAmount: {
        type: Number
    },
    dailyPercentage: {
        type: Number
    },
    dailyMailerList: {
        type: Schema.Types.ObjectId,
        ref: 'MailerList'
    },
    weeklyAmount: {
        type: Number
    },
    weeklyPercentage: {
        type: Number
    },
    weeklyMailerList: {
        type: Schema.Types.ObjectId,
        ref: 'MailerList'
    },
    cycleWiseAmount: {
        type: Number
    },
    cycleWisePercentage: {
        type: Number
    },
    cycleWiseMailerList: {
        type: Schema.Types.ObjectId,
        ref: 'MailerList'
    },
    monthlyAmount: {
        type: Number
    },
    monthlyPercentage: {
        type: Number
    },
    monthlyMailerList: {
        type: Schema.Types.ObjectId,
        ref: 'MailerList'
    },
    isDeleted: {
        type: Number,
        default: 0
    },
    isPlay: {
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
    }
});

schema.plugin(deepPopulate, {
    populate: {
        'oneHourMailerList': {
            select: ''
        },
        'threeHourMailerList': {
            select: ''
        },
        'sixHourMailerList': {
            select: ''
        },
        'twelveHourMailerList': {
            select: ''
        },
        'dailyMailerList': {
            select: ''
        },
        'weeklylyMailerList': {
            select: ''
        },
        'cycleWiseMailerList': {
            select: ''
        },
        'monthlyMailerList': {
            select: ''
        },
        'exposureMerchant': {
            select: '_id name'
        },
        'createdBy': {
            select: '_id name'
        },
        'lastUpdatedBy': {
            select: '_id name'
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('ExposureMerchantCat', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, 'oneHourMailerList threeHourMailerList sixHourMailerList twelveHourMailerList dailyMailerList weeklyMailerList cycleWiseMailerList monthlyMailerList createdBy lastUpdatedBy exposureMerchant', 'oneHourMailerList threeHourMailerList sixHourMailerList twelveHourMailerList dailyMailerList weeklyMailerList cycleWiseMailerList monthlyMailerList createdBy lastUpdatedBy exposureMerchant'));
var model = {
    search: function (data, callback) {
        // console.log("in custom");
        // var maxRow = Config.maxRow;
        var maxRow = 10;
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
        ExposureMerchantCat.find({
                isDeleted: 0
            }).sort({
                createdAt: -1
            })
            .populate('oneHourMailerList threeHourMailerList sixHourMailerList twelveHourMailerList dailyMailerList weeklyMailerList cycleWiseMailerList monthlyMailerList createdBy lastUpdatedBy exposureMerchant')
            .order(options)
            .keyword(options)
            .page(options,
                function (err, found) {
                    if (err) {
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
        console.log("deleteWithChangeStatus ExposureMerchantCat service", data);
        var Const = this(data);
        ExposureMerchantCat.update({
            _id: data._id
        }, {
            $set: {
                isDeleted: 1
            }
        }, function (err, data2) {
            if (err) {
                // console.log("in if",err);
                callback(err);
            } else {
                // console.log("else");
                callback(null, data2);
            }
        });
    },
    playWithChangeStatus: function (data, callback) {
        // var Model = this;
        console.log("playWithChangeStatus ExposureMerchantCat service", data);
        var Const = this(data);
        ExposureMerchantCat.update({
            _id: data._id
        }, {
            $set: {
                isPlay: 1
            }
        }, function (err, data2) {
            if (err) {
                // console.log("in if",err);
                callback(err);
            } else {
                // console.log("else");
                callback(null, data2);
            }
        });
    },
    stopWithChangeStatus: function (data, callback) {
        // var Model = this;
        console.log("stopWithChangeStatus ExposureMerchantCat service", data);
        var Const = this(data);
        ExposureMerchantCat.update({
            _id: data._id
        }, {
            $set: {
                isPlay: 0
            }
        }, function (err, data2) {
            if (err) {
                // console.log("in if",err);
                callback(err);
            } else {
                // console.log("else");
                callback(null, data2);
            }
        });
    },
    collectionCaste: function (data, callback) {
        // var Model = this;
        console.log("stopWithChangeStatus ExposureMerchantCat service", data);
        ExposureMerchantCategory.find({
            isDeleted: 0
        }, function (err, found) {
            if (err) {
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, []);
            } else {
                _.forEach(found, function (value, key1) {
                    var ObjectToBeSave = {
                        createdAt: value.createdAt,
                        updatedAt: value.updatedAt,
                        name: value.name,
                        createdBy: value.createdBy,
                        lastUpdatedBy: value.lastUpdatedBy,
                        isDeleted: value.isDeleted,
                        exposureMerchant: value.exposureMerchant
                    };
                    console.log(key1);
                    _.forEach(value.rules, function (rule, key2) {
                        // console.log("rule",rule);
                        if (rule.exposureRuleType == "5a69adc35bbe42131b758363") {
                            ObjectToBeSave.oneHourAmount = rule.transactionAmount;
                            ObjectToBeSave.oneHourPercentage = rule.percentageContribution;
                            ObjectToBeSave.oneHourMailerList = rule.mailerList;
                        } else if (rule.exposureRuleType == "5a69add75bbe42131b758364") {
                            ObjectToBeSave.threeHourAmount = rule.transactionAmount;
                            ObjectToBeSave.threeHourPercentage = rule.percentageContribution;
                            ObjectToBeSave.threeHourMailerList = rule.mailerList;
                        } else if (rule.exposureRuleType == "5a69ade55bbe42131b758365") {
                            ObjectToBeSave.sixHourAmount = rule.transactionAmount;
                            ObjectToBeSave.sixHourPercentage = rule.percentageContribution;
                            ObjectToBeSave.sixHourMailerList = rule.mailerList;
                        } else if (rule.exposureRuleType == "5a69adf15bbe42131b758366") {
                            ObjectToBeSave.twelveHourAmount = rule.transactionAmount;
                            ObjectToBeSave.twelveHourPercentage = rule.percentageContribution;
                            ObjectToBeSave.twelveHourMailerList = rule.mailerList;
                        } else if (rule.exposureRuleType == "5a69ae045bbe42131b758367") {
                            ObjectToBeSave.dailyAmount = rule.transactionAmount;
                            ObjectToBeSave.dailyPercentage = rule.percentageContribution;
                            ObjectToBeSave.dailyMailerList = rule.mailerList;
                        } else if (rule.exposureRuleType == "5a69ae125bbe42131b758368") {
                            ObjectToBeSave.weeklyAmount = rule.transactionAmount;
                            ObjectToBeSave.weeklyPercentage = rule.percentageContribution;
                            ObjectToBeSave.weeklyMailerList = rule.mailerList;
                        } else if (rule.exposureRuleType == "5a69ae1c5bbe42131b758369") {
                            ObjectToBeSave.monthlyAmount = rule.transactionAmount;
                            ObjectToBeSave.monthlyPercentage = rule.percentageContribution;
                            ObjectToBeSave.monthlyMailerList = rule.mailerList;
                        } else if (rule.exposureRuleType == "5a69ae2b5bbe42131b75836a") {
                            ObjectToBeSave.cycleWiseAmount = rule.transactionAmount;
                            ObjectToBeSave.cycleWisePercentage = rule.percentageContribution;
                            ObjectToBeSave.cycleWiseMailerList = rule.mailerList;
                        }
                        // console.log("key-",key1," ObjectValue-",ObjectToBeSave);
                    });
                    console.log("key-", key1, " ObjectValue-", ObjectToBeSave);

                    ExposureMerchantCat.saveData(ObjectToBeSave, function (err, doc) {
                        if (err) {
                            callback('there was a problem updating',null);
                        } else {
                            console.log("added",ObjectToBeSave.name);
                        }
                    });
                });
                callback(null, found);
            }
        });
        // var Const = this(data);
        // ExposureMerchantCat.update({
        //     _id: data._id
        // }, {
        //     $set: {
        //         isPlay: 0
        //     }
        // }, function (err, data2) {
        //     if (err) {
        //         // console.log("in if",err);
        //         callback(err);
        //     } else {
        //         // console.log("else");
        //         callback(null, data2);
        //     }
        // });
    }
};
module.exports = _.assign(module.exports, exports, model);