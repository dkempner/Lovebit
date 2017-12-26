const moment = require('moment');
const _ = require('lodash');
const twilio = require('twilio');

class FitbitHeartRateService {
    constructor(apiService) {
        this.recentHeartRates = [];
        this.apiService = apiService;
        this.lastRequest = moment().utc().format('HH:MM');
    }
    getHeartRate() {
        var now = moment().utc();
        var todayString = now.format('YYYY-MM-DD');
        var nowString = now.add(1, 'minutes').format('HH:MM');
        this.lastRequest = nowString;

        return this.apiService.get(`/activities/heart/date/${todayString}/1d/1sec.json`).then((response) => {
            if (!response) return 0;
            var res0 = response[0];
            if (!res0) return 0;
            var intra = res0['activities-heart-intraday']['dataset'];
            if (!intra) return 0;
            var last = _(intra).last();
            if (!last) return 0;
            return last.value;
        }, () => {
            return 0;
        });
    }
    handleHeartRate(rate) {
        if (!rate) return Promise.resolve(null);
        if (rate < 100) return Promise.resolve(null);
        var twilioClient = new twilio('AC0d580e78b089a449d4d9ac1f652750c0', 'bf65fc2ce4cb144d484fed68af7d7d31');

        return twilioClient.messages.create({
            body: 'Heart Rate: ' + rate,
            to: '+14102791376',
            from: '+18582240704'
        });

    }
}

module.exports = FitbitHeartRateService;