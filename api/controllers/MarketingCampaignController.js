module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {

    saveOld: function (req, res) {
        MarketingCampaign.saveData(req.body, res.callback);
    },
    save: function (req, res) {
        
        if(req.body.eligibilityStartDate){
            var eligibilityStartDate=new Date(req.body.eligibilityStartDate);
            var momentFrom = moment(eligibilityStartDate, 'ddd MMM D YYYY HH:mm:ss ZZ');
            console.log("momentFrom",momentFrom);
            momentFrom.set({h: 12, m: 00, s: 00});
            console.log("momentFrom-format",momentFrom.format());
            req.body.eligibilityStartDate=momentFrom.format();
        }

        if(req.body.eligibilityEndDate){
            var eligibilityEndDate=new Date(req.body.eligibilityEndDate);
            var momentFrom = moment(eligibilityEndDate, 'ddd MMM D YYYY HH:mm:ss ZZ');
            console.log("momentFrom",momentFrom);
            momentFrom.set({h: 12, m: 00, s: 00});
            console.log("momentFrom-format",momentFrom.format());
            req.body.eligibilityEndDate=momentFrom.format();
        }
        
        if(req.body.transactionStartDate){
            var transactionStartDate=new Date(req.body.transactionStartDate);
            var momentFrom = moment(transactionStartDate, 'ddd MMM D YYYY HH:mm:ss ZZ');
            console.log("momentFrom",momentFrom);
            momentFrom.set({h: 12, m: 00, s: 00});
            console.log("momentFrom-format",momentFrom.format());
            req.body.transactionStartDate=momentFrom.format();
        }

        if(req.body.transactionEndDate){
            var transactionEndDate=new Date(req.body.transactionEndDate);
            var momentFrom = moment(transactionEndDate, 'ddd MMM D YYYY HH:mm:ss ZZ');
            console.log("momentFrom",momentFrom);
            momentFrom.set({h: 12, m: 00, s: 00});
            console.log("momentFrom-format",momentFrom.format());
            req.body.transactionEndDate=momentFrom.format();
        }
        
        MarketingCampaign.saveData(req.body, res.callback);
    },
    deleteWithChangeStatus: function (req, res) {
        if (req.body) {
            if (mongoose.Types.ObjectId.isValid(req.body._id)) {
                MarketingCampaign.deleteWithChangeStatus(req.body, res.callback);
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
                MarketingCampaign.changeAllValues(req.body, res.callback);
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
            MarketingCampaign.getAllAutomated(req.body, res.callback);
        } else {
            res.json({
                message: {
                    data: "Invalid request!"
                }
            });
        }
    },

    getAllMarketingCampaigns: function (req, res) {
        if (req.body) {
            MarketingCampaign.getAllMarketingCampaigns(req.body, res.callback);
        } else {
            res.json({
                message: {
                    data: "Invalid request!"
                }
            });
        }
    },

    getAllCurrentMarketingCampaigns: function (req, res) {
        if (req.body) {
            MarketingCampaign.getAllCurrentMarketingCampaigns(req.body, res.callback);
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
            MarketingCampaign.playSelectedEmail(req.body, res.callback);
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
