module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {

    save: function (req, res) {
        if(!req.body.affluenceScoreOperator){
            req.body.affluenceScoreOperator=null;
            req.body.affluenceScore=null;
            console.log("affluenceScoreOperator",req.body.affluenceScoreOperator);
        }

        if(!req.body.engagementScoreOperator){
            console.log("engagementScoreOperator",req.body.engagementScoreOperator);
            req.body.engagementScoreOperator=null;
            req.body.engagementScore=null;
        }
        
        if(!req.body.digitalRiskScoreOperator){
            console.log("digitalRiskScoreOperator",req.body.digitalRiskScoreOperator);
            req.body.digitalRiskScoreOperator=null;
            req.body.digitalRiskScore=null;
        }
        
        // if(req.body.validFrom){
        //     var validFromDate=new Date(req.body.validFrom);
        //     var momentFrom = moment(validFromDate, 'ddd MMM D YYYY HH:mm:ss ZZ');
        //     console.log("momentFrom",momentFrom);
        //     momentFrom.set({h: 12, m: 00, s: 00});
        //     console.log("momentFrom-format",momentFrom.format());
        //     req.body.validFrom=momentFrom.format();
        // }
        // if(req.body.validTo){
        //     var validToDate=new Date(req.body.validTo);
        //     var momentTo = moment(validToDate, 'ddd MMM D YYYY HH:mm:ss ZZ');
        //     console.log("momentTo",momentTo);
        //     momentTo.set({h: 12, m: 00, s: 00});
        //     // console.log("momentTo-format",momentTo.format());
        //     req.body.validTo=momentTo.format();
        // }
        MarketingRule.saveData(req.body, res.callback);
    },
    deleteWithChangeStatus: function (req, res) {
        if (req.body) {
            if (mongoose.Types.ObjectId.isValid(req.body._id)) {
                MarketingRule.deleteWithChangeStatus(req.body, res.callback);
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
