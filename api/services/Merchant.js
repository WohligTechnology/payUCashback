var schema = new Schema({
  name: {
        type: String, 
    },
    merchantSqlId: {
        type: String
    },
    isDeleted:{
        type:Number,
        default: 0
    }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Merchant', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
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




        var aggregatePipeline = [
            // Stage 1
            {
                $lookup: {
                    "from": "rules",
                    "localField": "_id",
                    "foreignField": "merchant",
                    "as": "rules"
                }
            }
        ];

            // Stage 2
            aggregatePipeline.push({
                $match: {
                    "isDeleted": 0
                }
            });
        


        async.parallel({
            options: function (callback) {
                callback(null, options);
            },
            results: function (callback) {
                Model.aggregate(
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
                Model.aggregate(
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
                console.log("in if",err);
                callback(err);
            } else {
                // console.log("data2",data2.results);
                _.forEach(data2.results, function(value) {
                    // console.log("value",value);
                    var isNotDeletedRules=[];
                    _.forEach(value.rules, function(rule) {
                        if(rule.isDeleted==0){
                            // console.log("rule.isselected==0",rule);
                            isNotDeletedRules.push(rule);
                        }
                    });
                    // console.log("isNotDeletedRules",isNotDeletedRules);
                    value.notDeletedRules=isNotDeletedRules;
                  });
                // console.log("in else->after processing data2 ",data2);
                callback(null, data2);
            }
        });

    },

    searchOld: function (data, callback) {
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
        Merchant.find({
                isDeleted: 0
            }).sort({
                createdAt: 1
            })
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
        var Const = this(data);
        Merchant.update({
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
    }
};
module.exports = _.assign(module.exports, exports, model);