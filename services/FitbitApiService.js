var Q = require('q');


class FitbitApiService {

    constructor(apiClient) {
        this.redirectUriBase = 'http://localhost:3000/';
        this.fitbitRedirect = this.redirectUriBase + 'fitbit-auth-response';
        this.apiClient = apiClient;
        this.authCode = '';
        this.accessToken = '';
        this.refreshToken = '';
        this.authorizeUrl = ''
        this.authed = false;
    }
    getFitbitAuthUrl() {
        this.authorizeUrl = this.apiClient.getAuthorizeUrl('heartrate', this.fitbitRedirect);
        return this.authorizeUrl;
    }
    getFitbitAccessToken() {
        if (!this.authCode) return Promise.reject();
        var promise = this.apiClient.getAccessToken(this.authCode, this.fitbitRedirect);
        promise.then((response) => {
            this.accessToken = response.access_token;
            this.refreshToken = response.refresh_token;
            this.authed = true;
        });
        return promise;
    }
    get(url) {
        var def = Q.defer();
        if (!this.authCode) {
            def.reject();
            return def.promise;
        }
        if (!this.accessToken) {
            var getToken = this.getFitbitAccessToken();
            getToken.done(() => {
                var secondTry = this.get(url);
                secondTry.done(def.resolve);
                secondTry.fail(def.reject);
            });
            return def.promise;
        }
        var myTry = this.apiClient.get(url, this.accessToken);
        myTry.done(def.resolve);
        myTry.fail(def.reject);
        return def.promise;
    }
}

module.exports = FitbitApiService;