module.exports = () => {
    bot.dialog('/submitPhone', [
        (session, results, next) => {
                builder.Prompts.text(session, 'SubmitPhone');                
        },
        (session, results, next) => {
            session.userData.Phone = results.response;
            session.send('ThankYouPhoneStored', session.userData.Phone)

            /* TODO: Confirm phone number after submission.
               TODO: Validate phone number */

            session.endDialog();
        }

    ]);
};