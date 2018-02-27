module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {

    deleteWithChangeStatus: function (req, res) {
        if (req.body) {
            if (mongoose.Types.ObjectId.isValid(req.body._id)) {
                PerformanceRepay.deleteWithChangeStatus(req.body, res.callback);
            } else {
                res.json({
                    value: false,
                    data: "ObjectId Invalid"
                });
            }
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }

    }
    
};
module.exports = _.assign(module.exports, controller);
