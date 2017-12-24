const express = require('express');
const Agenda = require('agenda');
const FitbitApiClient = require('fitbit-node');
const moment = require('moment');

const app = express();
const redirectUriBase = 'http://localhost:3000/';
const fitbitRedirect = redirectUriBase + 'fitbit-auth-response';

var currentAccessToken = '';

var fitbitApiClient = new FitbitApiClient('22CH7N', '2312d65226b5710672fdff7ebe8d1e17');

var getFitbitAuthUrl = () => {
    return fitbitApiClient.getAuthorizeUrl('heartrate', fitbitRedirect);
};

var getFitbitAccessToken = (authCode) => {
    return fitbitApiClient.getAccessToken(authCode, fitbitRedirect);
};

var getCurrentHeartRate = (token) => {
    return fitbitApiClient.get('/activities/heart/date/2017-12-21/1d/1sec/time/00:00/23:59.json', token);
    //return fitbitApiClient.get('/profile.json', token);

};



app.get('/', (req, res) => res.send('Hello World'));
app.get('/fitbit-auth', (req, res) => {
    var responseUrl = getFitbitAuthUrl();
    res.redirect(responseUrl);
});
app.get('/fitbit-auth-response', (req, res) => {
    var authCode = req.query.code;
    var getAccessToken = getFitbitAccessToken(authCode);
    getAccessToken.then((result) => {
        currentAccessToken = result.access_token;
        getCurrentHeartRate(currentAccessToken).then((result) => {
            res.send(result[0]['activities-heart-intraday']['dataset']);
        });
    });
});
app.listen('3000');

// agenda is background job processing
const agendaConnectionString = 'mongodb://localhost:27017/agenda';
var agenda = new Agenda({ db: { address: agendaConnectionString } });


agenda.define('refresh-heartrate', (job, done) => {
    console.log('doing it');
    // done();
    // getCurrentHeartRate(currentAccessToken).then(result => {
    //     debugger;
    //     done();
    // });
});

agenda.on('ready', () => {
    agenda.every('2 seconds', 'refresh-heartrate');
    agenda.start();
});

