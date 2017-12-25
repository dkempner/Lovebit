const express = require('express');
const Agenda = require('agenda');
const Agendash = require('agendash');
const FitbitApiClient = require('fitbit-node');
const moment = require('moment');
const path = require('path');
const FitbitApiService = require('./services/FitbitApiService');
const FitbitHeartRateService = require('./services/FitbitHeartRateService');

const app = express();

var fitbitApiClient = new FitbitApiClient('22CH7N', '2312d65226b5710672fdff7ebe8d1e17');
var fitbitApiService = new FitbitApiService(fitbitApiClient);
var heartRateService = new FitbitHeartRateService(fitbitApiService);

var getCurrentHeartRate = (token) => {
    return fitbitApiClient.get('/activities/heart/date/2017-12-21/1d/1sec/time/00:00/23:59.json', token);
};


app.use(express.static(path.join(__dirname, 'client/dist')));
app.get('/fitbit-auth', (req, res) => {
    res.redirect(fitbitApiService.getFitbitAuthUrl());
});
app.get('/fitbit-auth-response', (req, res) => {
    fitbitApiService.authCode = req.query.code;
    res.redirect('/');
});
app.listen('3000');




// agenda is background job processing
const agendaConnectionString = 'mongodb://localhost:27017/agenda';
var agenda = new Agenda({ db: { address: agendaConnectionString } });

app.use('/agenda', Agendash(agenda));

agenda.define('refresh-heartrate', (job, done) => {
    var getHR = heartRateService.getHeartRate();
    getHR.then(function(){
        done();
    });
    getHR.fail(function(){
        done();
    });

});

agenda.on('ready', () => {
    agenda.every('10 seconds', 'refresh-heartrate');
    agenda.start();
    console.log('Agenda started...');
});

        // getCurrentHeartRate(currentAccessToken).then((result) => {
        //     res.send(result[0]['activities-heart-intraday']['dataset']);
        // });
