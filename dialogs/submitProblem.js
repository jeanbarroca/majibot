module.exports = () => {
    const request = require('request');

    function getServices (url, callback) {
        request(url, (error, response, body) => {
            if (!error && response && response.statusCode == 200) {
                let result = JSON.parse(body);
                callback(null, result);
            } else {
                callback(error, null);
            }
        });
    };

    bot.dialog('/submitProblem', [
        (session) => {

            getServices('http://www.mopa.co.mz/georeport/v2/services.json', (err, results) => {

                let choices = [];

                for (let i = 0; i < results.length; i++) {
                    choices.push(results[i].service_name);
                }

                builder.Prompts.choice(session, 'SubmitProblem', choices);
            });

        }]);
};