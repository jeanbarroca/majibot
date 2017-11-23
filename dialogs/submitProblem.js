module.exports = () => {
    bot.dialog('/submitProblem', [
        // Step 1: Choose problem category
        (session, next) => {
            session.beginDialog('/requestServiceCategory');
        },
        // Step 2: Request location
        (session, results, next) => {
            session.beginDialog('/requestLocation');
        },

        // Step 3: Additional details
        (session, results, next) => {
            session.beginDialog('/requestAdditionalDetails');
        }
    ]);

    bot.dialog('/requestServiceCategory', [
        (session, next) => {
            getServices(process.env.OPEN311_ENDPOINT + 'services.json', (err, results) => {
                if (err) {
                    session.error(err);
                } else {
                    let choices = results.map((service) => service.service_name);
                    session.dialogData.services = results;
                    builder.Prompts.choice(session, 'SubmitProblem', choices);
                }
            });
        },
        (session, results, next) => {
            session.conversationData.service_code = session.dialogData.services[results.response.index].service_code;
            session.send(`You submitted ${session.dialogData.services[results.response.index].service_name}`);
            session.endDialogWithResult({'service_name': results.response.entity});
        }
    ]);

    bot.dialog('/requestLocation', [
        // Step 2: Request location
        (session, results, next) => {

            quickReplies.LocationPrompt.beginDialog(session);

        },
        (session, args, next) => {

            if (args.response) {
                let location = args.response.entity;

                session.send(`Your location is : ${location.title}, Longitude: ${location.coordinates.long}, Latitude: ${location.coordinates.lat}`);
                session.conversationData.lat = args.response.entity.location.coordinates.lat;
                session.conversationData.long = args.response.entity.location.coordinates.long;

                // is user's phone set? if not, request it.
                if (!session.userData.Phone) {
                    session.replaceDialog('/submitPhone');
                }

                session.replaceDialog('/requestAdditionalDetails');
            }
            else {
                session.replaceDialog('/requestAdditionalDetails');
            }
        }
    ]);

    bot.dialog('/requestAdditionalDetails', [
        (session, next) => {
            let options =  session.localizer.gettext(session.preferredLocale(), "AdditionalDetailsOptions");
            builder.Prompts.choice(session, 'AdditionalDetailsPrompt', options);
        },
        (session, results) => {
            session.conversationData.description = results.response.entity;
            session.send(`Success!\n Service request description\n Phone: ${session.userData.Phone}\n Service code: ${session.conversationData.service_code}\n Coordinates: ${session.conversationData.lat}, ${session.conversationData.long}\n Description: ${session.conversationData.description}`);
            session.replaceDialog('/');
        }
    ]);
};