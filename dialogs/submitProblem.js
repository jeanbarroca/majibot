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
        (session, next) => {

            getServices('http://www.mopa.co.mz/georeport/v2/services.json', (err, results) => {
                if (err) {
                    session.error(err);
                } else {
                    let choices = [];
                    for (let i = 0; i < results.length; i++) {
                        choices.push(results[i].service_name);
                    }
                    builder.Prompts.choice(session, 'SubmitProblem', choices);
                }
            });
        },
        (session, args, next) => {
            quickReplies.LocationPrompt.beginDialog(session);
        },
        (session, args, next) => {
            if (args.response) {
                var location = args.response.entity;
                session.send(`Your location is : ${location.title}, Longitude: ${location.coordinates.long}, Latitude: ${location.coordinates.lat}`);
            }
        }]);
};