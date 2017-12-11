module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    deleteWithChangeStatus: function (req, res) {
        if (req.body) {
            if (mongoose.Types.ObjectId.isValid(req.body._id)) {
                Rule.deleteWithChangeStatus(req.body, res.callback);
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

    },
    getAllAutomated: function (req, res) {
        if (req.body) {
            Rule.getAllAutomated(req.body, res.callback);
        } else {
            res.json({
                message: {
                    data: "Invalid request!"
                }
            });
        }
    },

    getAllRules: function (req, res) {
        if (req.body) {
            Rule.getAllRules(req.body, res.callback);
        } else {
            res.json({
                message: {
                    data: "Invalid request!"
                }
            });
        }
    },

    getAllCurrentRules: function (req, res) {
        if (req.body) {
            Rule.getAllCurrentRules(req.body, res.callback);
        } else {
            res.json({
                message: {
                    data: "Invalid request!"
                }
            });
        }
    },

    playSelectedEmail: function (req, res) {
        if (req.body) {
            Rule.playSelectedEmail(req.body, res.callback);
        } else {
            res.json({
                message: {
                    data: "Invalid request!"
                }
            });
        }
    }
};
module.exports = _.assign(module.exports, controller);
