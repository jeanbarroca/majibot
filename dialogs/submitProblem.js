module.exports = () => {
    bot.dialog('/submitProblem', [
        // Step 1: Choose problem category
        (session, args, next) => {
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
        // Step 5: Submit request
        (session) => {
            session.beginDialog('/submitRequest');
        }
    ]);

    bot.dialog('/requestServiceCategory', [
        (session, args, next) => {
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
        (session, args, next) => {

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
        (session, args, next) => {
            let options = session.localizer.gettext(session.preferredLocale(), 'AdditionalDetailsOptions');
            builder.Prompts.choice(session, 'AdditionalDetailsPrompt', options, {'listStyle': 3});
        },
        (session, results, next) => {

            let selection = results.response.entity;

            switch (selection) {
            case 'Send text':
                builder.Prompts.text(session, 'AddDescription');
                break;
            case 'Send picture':
                builder.Prompts.attachment(session, 'AddPhoto');
                break;
            case 'Continue':
                session.conversationData.description = 'Created via Facebook Bot';
                session.endDialog();
                break;
            default:
                session.endDialog();        
                break;
            }
        },
        (session, results, next) => {
            if (results.childId === "BotBuilder:prompt-text") {
                session.conversationData.description = results.response;
                session.endDialog();
            }
            else {
                session.conversationData.media_url = results.response.map((attachment) => attachment.contentUrl);
                session.conversationData.description = 'Created via Facebook Bot';
                builder.Prompts.confirm(session,'AddDescription?');
            }
        },
        (session, results, next) => {
            if (results.response) {
                builder.Prompts.text(session, 'AddDescription');                
            }
            else {
                session.endDialog();
            }
        },
        (session, results, next) => {
            session.conversationData.description = results.response;
            session.endDialog();
        }
    ]);

    bot.dialog('/submitRequest', [
        (session, args, next) => {
            if (session.userData.Phone == null) {            
                session.beginDialog('/submitPhone');
            }
            else {
                next();
            }
        },
        (session, results, next) => {
            session.send('ConfirmPhone', session.userData.Phone);
            builder.Prompts.confirm(session, 'Ok?');           
        },
        (session, results, next) => {
            if (results.response) {
                next();
            }
            else {
                session.beginDialog('/submitPhone');
            }
        },
        (session, results, next) => {

            let serviceRequest = {
                'description': session.conversationData.description,
                'first_name': (session.message.address.user.name) ? session.message.address.user.name : '',
                'lat': (session.conversationData.lat) ? session.conversationData.lat : process.env.DEFAULT_LAT,
                'long': (session.conversationData.long) ? session.conversationData.long : process.env.DEFAULT_LONG,
                'media_url': (session.conversationData.media_url) ? session.conversationData.media_url : '',
                'phone': session.userData.Phone,
                'service_code': session.conversationData.service_code
            }

            submitServiceRequest(serviceRequest, (err, results) => {
                if (err) {
                    session.error(err);
                    session.endDialog();                    
                } else {
                    session.send('NewProblemThankYou', results.pop().service_request_id);
                    session.endConversation();
                }
            });
        }
    ]);
};