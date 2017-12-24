const express = require('express');
const Agenda = require('agenda');
const app = express();
const FitbitApiClient = require('fitbit-node');




var fitbitApiClient = new FitbitApiClient('22CH7N', '2312d65226b5710672fdff7ebe8d1e17');

var getFitbitAuthUrl = () => {
    return fitbitApiClient.getAuthorizeUrl('heartrate', 'http://localhost:3000/fitbit-auth-response');
};




app.get('/', (req, res) => res.send('Hello World'));
app.get('/fitbit-auth', (req, res) => {
    var responseUrl = getFitbitAuthUrl();
    res.redirect(responseUrl);
});
app.get('/fitbit-auth-response', (req, res) => {
    var fitbitAuthCode = req.query.code;
});
app.listen('3000');










// agenda is background job processing
const agendaConnectionString = 'mongodb://localhost:27017/agenda';
var agenda = new Agenda({ db: { address: agendaConnectionString } });


agenda.define('log', () => {
    console.log('Im logging');
})

agenda.on('ready', () => {
    agenda.every('10 seconds', 'log');
    agenda.start();
});

