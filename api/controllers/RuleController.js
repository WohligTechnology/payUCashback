module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {

    save: function (req, res) {
        // var validFromDate=new Date(req.body.validFrom);
        // var momentFrom = moment(validFromDate, 'ddd MMM D YYYY HH:mm:ss ZZ');
        // console.log("momentFrom",momentFrom);
        // momentFrom.set({h: 05, m: 31, s: 00});
        // console.log("momentFrom-format",momentFrom.format());
        // req.body.validFrom=momentFrom.format();

        // var validToDate=new Date(req.body.validTo);
        // var momentTo = moment(validToDate, 'ddd MMM D YYYY HH:mm:ss ZZ');
        // console.log("momentTo",momentTo);
        // momentTo.set({h: 05, m: 31, s: 00});
        // // console.log("momentTo-format",momentTo.format());
        // req.body.validTo=momentTo.format();

        if(req.body.validFrom){
            var validFromDate=new Date(req.body.validFrom);
            var momentFrom = moment(validFromDate, 'ddd MMM D YYYY HH:mm:ss ZZ');
            console.log("momentFrom",momentFrom);
            momentFrom.set({h: 06, m: 00, s: 00});
            console.log("momentFrom-format",momentFrom.format());
            req.body.validFrom=momentFrom.format();
        }
        if(req.body.validTo){
            var validToDate=new Date(req.body.validTo);
            var momentTo = moment(validToDate, 'ddd MMM D YYYY HH:mm:ss ZZ');
            console.log("momentTo",momentTo);
            momentTo.set({h: 06, m: 00, s: 00});
            // console.log("momentTo-format",momentTo.format());
            req.body.validTo=momentTo.format();
        }
        Rule.saveData(req.body, res.callback);
    },
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
    changeAllValues: function (req, res) {
        console.log("insile changeAllValues controller",req.body);
        if (req.body) {
            if (req.body.value && req.body.lastUpdatedBy) {
                Rule.changeAllValues(req.body, res.callback);
            } else {
                res.json({
                    value: false,
                    data: "Data is Appropriate"
                });
            }
        }else {
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
