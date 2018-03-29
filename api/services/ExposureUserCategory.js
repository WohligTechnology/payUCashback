var schema = new Schema({
    name: {
        type: String,
        unique: true
    },
    lowerBoundRiskScore: {
        type: Number
    },
    upperBoundRiskScore: {
        type: Number
    },
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
    userType: {
        type: String,
        enum: ["NEW", "NON-REPAID", "REPAID"]
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
        'createdBy': {
            select: ''
        },
        'lastUpdatedBy': {
            select: ''
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('ExposureUserCategory', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, 'oneHourMailerList threeHourMailerList sixHourMailerList twelveHourMailerList dailyMailerList weeklyMailerList cycleWiseMailerList monthlyMailerList createdBy lastUpdatedBy', 'oneHourMailerList threeHourMailerList sixHourMailerList twelveHourMailerList dailyMailerList weeklyMailerList cycleWiseMailerList monthlyMailerList createdBy lastUpdatedBy'));
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
        ExposureUserCategory.find({
                isDeleted: 0
            }).sort({
                createdAt: -1
            })
            .populate('oneHourMailerList threeHourMailerList sixHourMailerList twelveHourMailerList dailyMailerList weeklyMailerList cycleWiseMailerList monthlyMailerList createdBy lastUpdatedBy')
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
        console.log("deleteWithChangeStatus ExposureUserCategory service", data);
        var Const = this(data);
        ExposureUserCategory.update({
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
        console.log("playWithChangeStatus ExposureUserCategory service", data);
        var Const = this(data);
        ExposureUserCategory.update({
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
        console.log("stopWithChangeStatus ExposureUserCategory service", data);
        var Const = this(data);
        ExposureUserCategory.update({
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
    }
};
module.exports = _.assign(module.exports, exports, model);