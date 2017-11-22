module.exports = () => {
    bot.dialog('/selectLocale', [
        (session) => {
            // Prompt the user to select their preferred locale
            builder.Prompts.choice(session, 'What\'s your preferred language?', 'English|Swahili');
        },
        (session, results) => {
            // Update preferred locale
            let locale;

            switch (results.response.entity) {
            case 'English':
                locale = 'en';
                break;
            case 'Swahili':
                locale = 'sw_TZ';
                break;
            default:
                locale = 'en';
                break;
            }
            session.preferredLocale(locale, (err) => {
                if (err) {
                    // Problem loading the selected locale
                    session.error(err);
                } else {
                    // Locale files loaded
                    session.send(`Your preferred language is now ${results.response.entity}`);
                    session.replaceDialog('/promptButtons');
                }
            });
        }
    ]);
};