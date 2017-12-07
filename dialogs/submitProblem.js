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
        },
        // Step 4: Submit request
        (session) => {
            session.beginDialog('/submitRequest');
        }
    ]);

    bot.dialog('/requestServiceCategory', [
        (session, next) => {
            getServices((err, results) => {
                if (err) {
                    session.error(err);
                } else {
                    let choices = results.map((service) => service.service_name);
                    session.dialogData.services = results;
                    builder.Prompts.choice(session, 'SubmitProblem', choices, {'listStyle': 3});
                }
            });
        },
        (session, results, next) => {
            session.conversationData.service_code = session.dialogData.services[results.response.index].service_code;
            session.send(`You submitted ${session.dialogData.services[results.response.index].service_name}`);
            session.endDialog();
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

                session.send(`Your location is: Longitude: ${location.coordinates.long}, Latitude: ${location.coordinates.lat}`);
                session.conversationData.lat = location.coordinates.lat;
                session.conversationData.long = location.coordinates.long;

                // is user's phone set? if not, request it.
                if (!session.userData.Phone) {
                    session.replaceDialog('/submitPhone');
                }
            }

            session.endDialog();

        }
    ]);

    bot.dialog('/requestAdditionalDetails', [
        (session, next) => {
            let options =  session.localizer.gettext(session.preferredLocale(), "AdditionalDetailsOptions");
            builder.Prompts.choice(session, 'AdditionalDetailsPrompt', options, {'listStyle': 3});
        },
        (session, results) => {
            session.conversationData.description = results.response.entity;
            session.send(`Success!\n Service request description\n Phone: ${session.userData.Phone}\n Service code: ${session.conversationData.service_code}\n Coordinates: ${session.conversationData.lat}, ${session.conversationData.long}\n Description: ${session.conversationData.description}`);
            session.endDialog();
        }
    ]);

    bot.dialog('/submitRequest', [
        (session, next) => {
            let serviceRequest = [];
            serviceRequest.service_code = session.conversationData.service_code;
            serviceRequest.lat = session.conversationData.lat;
            serviceRequest.long = session.conversationData.long;
            serviceRequest.phone = session.userData.Phone;

            submitServiceRequest(serviceRequest, (err, results) => {
                if (err) {
                    session.error(err);
                } else {
                    session.send(`Thanks! ${results.service_request_id}`);
                    session.endDialog();
                }
            });
        }
    ]);
};