module.exports = () => {
    bot.dialog('/submitProblem', [
        // Step 1: Choose problem category
        (session, results, next) => {
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
        // Step 4: Check phone
        (session, results, next) => {
            session.replaceDialog('/submitPhone');
        },
        // Step 5: Submit request
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

                if (location.coordinates.lat === null && location.coordinates.long === null) {
                    session.send('We could not get your coordinates. We will proceed with default coordinates in Dar es Salaam and fix that later');
                    session.conversationData.lat = process.env.LAT;
                    session.conversationData.long = process.env.LONG;
                }

                session.conversationData.lat = location.coordinates.lat;
                session.conversationData.long = location.coordinates.long;
            }

            session.endDialog();

        }
    ]);

    bot.dialog('/requestAdditionalDetails', [
        (session, next) => {
            let options = session.localizer.gettext(session.preferredLocale(), 'AdditionalDetailsOptions');
            builder.Prompts.choice(session, 'AdditionalDetailsPrompt', options, {'listStyle': 3});
        },
        (session, results, next) => {

            let selection = results.response.entity;

            switch (selection) {
            case 'Send text':
                session.endDialog();
                break;
            case 'Send picture':
                session.endDialog();
                break;
            case 'Continue':
                session.send('You chose continue.')
                session.endDialog();
                break;
            default:
                break;
            }
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
            serviceRequest.description = session.conversationData.description;

            submitServiceRequest(serviceRequest, (err, results) => {
                if (err) {
                    session.error(err);
                    session.endDialog();                    
                } else {
                    session.send(`Thanks! ${results[0].service_request_id}`);
                    session.endDialog();
                }
            });
        }
    ]);
};