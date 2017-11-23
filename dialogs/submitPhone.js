module.exports = () => {
    bot.dialog('/submitPhone', [
        (session, next) => {
            builder.Prompts.text(session, 'SubmitPhone');
        },
        (session, results, next) => {
            session.userData.Phone = results.response;
            session.endDialog();
        }

    ]);
};