module.exports = () => {

    const request = require('request');

    bot.dialog('/submitProblem', [
        // Step 1: Choose problem category
        (session, next) => {

            getServices(process.env.OPEN311_ENDPOINT + 'services.json', (err, results) => {
                if (err) {
                    session.error(err);
                } else {
                    let choices = results.map((service) => service.service_name);
                    builder.Prompts.choice(session, 'SubmitProblem', choices);
                }
            });
        },

        // Step 2: Request location
        (session) => {
            quickReplies.LocationPrompt.beginDialog(session);
        },
        (session, args, next) => {
            if (args.response) {
                var location = args.response.entity;
                session.send(`Your location is : ${location.title}, Longitude: ${location.coordinates.long}, Latitude: ${location.coordinates.lat}`);
            }

            // is user's phone set? if not, request it.

            let phone = session.userData.Phone;
            if (!phone) {
                session.replaceDialog('/submitPhone');
            }
        },
        // Step 3: Additional details
        (session, args, next) => {
            let options =  session.localizer.gettext(session.preferredLocale(), "AdditionalDetailsOptions");
            builder.Prompts.choice(session, 'AdditionalDetailsPrompt', options);
        }
    ]);

    const getServices = (url, callback) => {
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