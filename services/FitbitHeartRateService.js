const moment = require('moment');

class FitbitHeartRateService {
    constructor(apiService) {
        this.recentHeartRates = [];
        this.apiService = apiService;
        this.lastRequest = moment();
    }
    getHeartRate() {
        return this.apiService.get('/activities/heart/date/2017-12-21/1d/1sec/time/00:00/23:59.json');
    }
}

module.exports = FitbitHeartRateService;