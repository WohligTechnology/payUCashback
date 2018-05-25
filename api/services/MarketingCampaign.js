var schema = new Schema({
    name: {
        type: String,
        required: true
    },
    downloadOption: {
        type: String,
        default: "Both",
        enum: ['Email', 'Mobile', "Both"]
    },
    eligibilityFlag: {
        type: String,
        default: "false",
        enum: ['true', 'false']
    },
    eligibilityStartDate: {
        type: Date
    },
    eligibilityEndDate: {
        type: Date
    },
    eligibilityMerchant: {
        type: Schema.Types.ObjectId,
        ref: 'Merchant'
    },
    eligibilityStatus: [{
        type: Schema.Types.ObjectId,
        ref: 'EligibilityStatus'
    }],
    transactionFlag: {
        type: String,
        default: "none",
        enum: ['none', 'true', 'false']
    },
    transactionStartDate: {
        type: Date
    },
    transactionEndDate: {
        type: Date
    },
    transactionMerchant: {
        type: Schema.Types.ObjectId,
        ref: 'Merchant'
    },
    transactionStatus: {
        type: String,
        default: "SALE/REFUND",
        enum: ['SALE/REFUND', 'REPAY']
    },
    isDeleted: {
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
        'eligibilityMerchant': {
            select: 'name _id merchantSqlId'
        },
        'transactionMerchant': {
            select: 'name _id merchantSqlId'
        },
        'createdBy': {
            select: 'name _id email'
        },
        'lastUpdatedBy': {
            select: 'name _id email'
        },
        'eligibilityStatus': {
            select: ''
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('MarketingCampaign', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, 'eligibilityMerchant transactionMerchant eligibilityStatus createdBy lastUpdatedBy','eligibilityMerchant transactionMerchant eligibilityStatus createdBy lastUpdatedBy'));
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
        MarketingCampaign.find({
                isDeleted: 0
            }).sort({
                createdAt: -1
            })
            .populate('eligibilityMerchant transactionMerchant eligibilityStatus createdBy lastUpdatedBy')
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
        console.log("deleteWithChangeStatus MarketingCampaign service", data);
        var Const = this(data);
        MarketingCampaign.update({
            _id: data._id
        }, {
            $set: {
                isDeleted: 1
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
    }
};
module.exports = _.assign(module.exports, exports, model);