module.exports = () => {
    bot.dialog('/submitPhone', [
        (session) => {
            builder.Prompts.text(session, 'SubmitPhone');
        },
        (session, results) => {
            session.userData.Phone = results.response;

            /* TODO: Confirm phone number after submission.
               TODO: Validate phone number */

            session.endDialog();
        }

    ]);
};