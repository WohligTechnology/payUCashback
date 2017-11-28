var schema = new Schema({
  name: {
        type: String, 
    },
    img: {
        type: String
    },
    imgback: {
        type: String
    },
    id: {
        type: String
    }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Company', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);