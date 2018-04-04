var schema = new Schema({
    name: {
        type: String,
        required: true
    },
    sqlId: {
        type: Number
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
module.exports = mongoose.model('ExposureMerchant', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, 'createdBy lastUpdatedBy', 'createdBy lastUpdatedBy'));
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
        ExposureMerchant.find({
                isDeleted: 0
            }).sort({
                createdAt: -1
            })
            .populate('createdBy lastUpdatedBy')
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
    searchWithoutPopulate: function (data, callback) {
        // console.log("in custom");
        // var maxRow = Config.maxRow;
        var maxRow = 100000000;
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
        ExposureMerchant.find({
                isDeleted: 0
            },{_id:1,name:1,sqlId:1}).sort({
                createdAt: -1
            })
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
        console.log("deleteWithChangeStatus exposureMerchant service", data._id);
        // var Const = this(data);
        ExposureMerchant.update({
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

    getSingleWithPopulate: function (data, callback) {
        async.waterfall([
            function (callback) {
                // code a

                ExposureMerchant.findOne({
                        _id: data._id
                    })
                    .deepPopulate("createdBy lastUpdatedBy")
                    .exec(function (err, found) {
                        if (err) {
                            callback(err);
                        } else {
                            // console.log("found1", found); // OUTPUT OK
                            callback(null, found);
                        }
                    });
            },
            function (exposureMerchantData, callback) {
                // console.log("questionData", exposureMerchantData);
                exposureMerchantData.allExposureMerchantCategoryDetails=[{"a":123}];
                console.log(exposureMerchantData);
                _.forEach(exposureMerchantData.exposureMerchantCategory, function(value) {
                    // console.log(value);
                    ExposureMerchantCategory.findOne({
                        _id: value._id
                    })
                    .deepPopulate("exposureRule createdBy lastUpdatedBy")
                    .exec(function (err, singleExposureMerchantCategory) {
                        if (err) {
                            callback(err);
                        } else {
                            // console.log("found1", singleExposureMerchantCategory); // OUTPUT OK
                            exposureMerchantData.allExposureMerchantCategoryDetails.push(singleExposureMerchantCategory);
                            // callback(null, found);
                        }
                    });

                  });
                  callback(null,exposureMerchantData);


                // if (questionData) {
                //     console.log("questionData", questionData);
                //     Contest.findOne({
                //         questionId: questionData._id,
                //         email: data.email
                //     }).exec(function (err, contest) {

                //         if (!_.isEmpty(contest)) {
                //             console.log("user already exists for the contest", contest);
                //             callback("userExists", null);
                //         } else {
                //             console.log("saving user: ", data);
                //             Contest.saveData(data, function (err, data) {
                //                 callback(err, data);
                //             });
                //         }
                //     });
                // } else {
                //     callback("noQuestionsFound", data);
                // }
            }
        ], function (err, result) {
            if (err) {
                callback(err);
            } else {
                // console.log("last result", result); // OUTPUT OK
                callback(null, result);

            }
        });
    },
    viewSingleExposureMerchantModal:function(data,callback){

        var aggArrOld=[
            // Stage 1
            {
                $match: {
                    "_id":ObjectId(data._id)
                }
            },
    
            // Stage 2
            {
                $lookup: // Equality Match
                {
                    from: "exposuremerchantcategories",
                    localField: "exposureMerchantCategory",
                    foreignField: "_id",
                    as: "exposureMerchantCategory"
                }
                
            },
    
            // Stage 3
            {
                $unwind: {
                    path : "$exposureMerchantCategory"
                }
            },
    
            // Stage 4
            {
                $lookup: // Equality Match
                {
                    from: "exposurerules",
                    localField: "exposureMerchantCategory.exposureRule",
                    foreignField: "_id",
                    as: "exposureMerchantCategory.exposureRule"
                }
            },
    
        ];
    
        var aggArr=[
            // Stage 1
            {
                $lookup: // Equality Match
                {
                    from: "exposuremerchants",
                    localField: "exposureMerchant",
                    foreignField: "_id",
                    as: "exposureMerchant"
                }
                
            },
    
            // Stage 2
            {
                $unwind: {
                    path : "$exposureMerchant"
                }
            },
    
            // Stage 3
            {
                $match: {
                "exposureMerchant._id":ObjectId(data._id)
                }
            },
    
            // Stage 4
            {
                $lookup: // Equality Match
                {
                    from: "exposurerules",
                    localField: "exposureRule",
                    foreignField: "_id",
                    as: "exposureRule"
                }
            },
    
        ];
            async.parallel({
                results: function (callback) {
                    ExposureMerchantCategory.aggregate(aggArr, function (err, data1) {
                        if (err) {
                            callback(err, null);
                        } else {
                            callback(null, data1);
                        }
                    });
    
                }
            }, function (err, result) {
                if (err) {
                    console.log("in if", err);
                    callback(err);
                } else {
                    callback(null, result);
                }
            });
    }
};
module.exports = _.assign(module.exports, exports, model);