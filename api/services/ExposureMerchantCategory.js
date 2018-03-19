var schema = new Schema({
    name: {
        type: String,
        unique: true
    },
    exposureRule: [{
        type: Schema.Types.ObjectId,
        ref: 'ExposureRule'
    }],
    rules: [{
        mailerList: {
            type: Schema.Types.ObjectId,
            ref: 'MailerList',
            required: true
        },
        exposureRuleType: {
            type: Schema.Types.ObjectId,
            ref: 'ExposureRuleType',
            required: true
        },
        name: String,
        transactionAmount: Number,
        percentageContribution: Number
    }],
    exposureMerchant: [{
        type: Schema.Types.ObjectId,
        ref: 'ExposureMerchant'
    }],
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
        'rules': {
            select: ''
        },
        'rules.exposureRuleType': {
            select: ''
        },
        'rules.mailerList': {
            select: ''
        },
        'exposureRule': {
            select: ''
        },
        'createdBy': {
            select: 'name _id email'
        },
        'lastUpdatedBy': {
            select: 'name _id email'
        },
        'exposureMerchant': {
            select: ''
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('ExposureMerchantCategory', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, 'rules rules.exposureRuleType rules.mailerList exposureRule createdBy lastUpdatedBy exposureMerchant', 'rules rules.exposureRuleType rules.mailerList exposureRule createdBy lastUpdatedBy exposureMerchant'));
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
        ExposureMerchantCategory.find({
                isDeleted: 0
            }).sort({
                createdAt: -1
            })
            .populate('rules rules.exposureRuleType rules.mailerList exposureRule createdBy lastUpdatedBy exposureMerchant')
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
        console.log("deleteWithChangeStatus ExposureMerchantCategory service", data);
        var Const = this(data);
        ExposureMerchantCategory.update({
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
    }
};
module.exports = _.assign(module.exports, exports, model);