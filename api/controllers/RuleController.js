module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {

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
