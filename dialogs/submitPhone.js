module.exports = () => {
    bot.dialog('/submitPhone', [
        (session, results, next) => {
            if (session.userData.Phone === null) {
                builder.Prompts.text(session, 'SubmitPhone');                
            }
            else {
                session.endDialog();                
            }
        },
        (session, results, next) => {
            session.userData.Phone = results.response;

            /* TODO: Confirm phone number after submission.
               TODO: Validate phone number */

            session.endDialog();
        }

    ]);
};