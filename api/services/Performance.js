var schema = new Schema({
    name: {
        type: String
    },
    startDate:{
        type:Date
    },
    startTime: {
        type: String
    },
    endTime: {
        type: String
    },
    endDate:{
        type:Date
    },
    remark: {
        type: String
    },
    email: {
        type: String
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
  
  schema.plugin(deepPopulate, {});
  schema.plugin(uniqueValidator);
  schema.plugin(timestamps);
  module.exports = mongoose.model('Performance', schema);
  
  var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
  var model = {

    search: function (data, callback) {
        console.log("in custom kkkk");
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
                    fields: ['remark'],
                    term: data.keyword
                }
            },
            sort: {
                asc: 'createdAt'
            },
            start: (page - 1) * maxRow,
            count: maxRow
        };
        Performance.find({
                isDeleted: 0
            }).sort({
                createdAt: -1
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
        Performance.update({
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