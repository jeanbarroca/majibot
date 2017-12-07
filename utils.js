module.exports = () => {

    global.request = require('request');

    global.getServices = (callback) => {
        request(process.env.OPEN311_ENDPOINT + 'services.json', (error, response, body) => {
            if (!error && response && response.statusCode == 200) {
                let result = JSON.parse(body);
                callback(null, result);
            } else {
                callback(error, null);
            }
        });
    };

    global.submitServiceRequest = (serviceRequest, callback) => {
        request.post(process.env.OPEN311_ENDPOINT + 'requests.json', {form: serviceRequest}, (error, response, body) => {
            if (!error && response && response.statusCode == 200) {
                let result = JSON.parse(body);
                console.log(result);
                callback(null, result);
            } else {
                callback(error, null);
            }
        });
    };
};