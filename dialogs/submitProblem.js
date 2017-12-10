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
            session.beginDialog('/submitPhone');
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
                session.conversationData.description = 'Text';
                session.endDialog();
                break;
            case 'Send picture':
                session.conversationData.description = 'Picture';
                session.conversationData.media_url = 'https://www.mopa.co.mz/images/png/mopa-logo.png';
                session.endDialog();
                break;
            case 'Continue':
                session.conversationData.description = 'None';
                session.endDialog();
                break;
            default:
                session.endDialog();        
                break;
            }
        }
    ]);

    bot.dialog('/submitRequest', [
        (session, next) => {
            let serviceRequest = {
                'description': session.conversationData.description,
                'first_name': (session.message.address.user.name) ? session.message.address.user.name : '',
                'lat': (session.conversationData.lat) ? session.conversationData.lat : process.env.DEFAULT_LAT,
                'long': (session.conversationData.long) ? session.conversationData.long : process.env.DEFAULT_LONG,
                'phone': session.userData.Phone,
                'service_code' : session.conversationData.service_code
            }

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