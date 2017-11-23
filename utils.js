module.exports = () => {

    global.request = require('request');

    global.getServices = function (url, callback) {
        request(url, (error, response, body) => {
            if (!error && response && response.statusCode == 200) {
                let result = JSON.parse(body);
                callback(null, result);
            } else {
                callback(error, null);
            }
        });
    };
};