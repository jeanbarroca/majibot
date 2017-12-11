require('dotenv-extended').load();

require('./connectorSetup')();
require('./utils.js')();


require('./dialogs/selectLocale')();
require('./dialogs/submitProblem')();
require('./dialogs/submitPhone')();


/*
require('./dialogs/checkProblems.js')();
require('./dialogs/checkMyBill.js')();
*/


// Global actions
bot.endConversationAction('goodbye', 'Goodbye :)', { matches: /^cancel/i });
bot.beginDialogAction('help', '/help', { matches: /^help/i });
bot.beginDialogAction('language', '/selectLocale', { matches: /^language/i });
bot.beginDialogAction('phone', '/submitPhone', { matches: /^phone/i });
bot.beginDialogAction('submitProblem', '/submitProblem');

// Entry point of the bot
bot.dialog('/', [
    (session) => {
        session.replaceDialog('/promptButtons');
    }
]);

bot.dialog('/promptButtons', [
    (session, args, next) => {
        let choices = ['Submit a problem', 'Change phone number', 'Change language'];
        builder.Prompts.choice(session, 'InitialPrompt', choices, {'listStyle': 3});
    },
    (session, results, next) => {
        if (results.response) {
            let selection = results.response.entity;

            // route to corresponding dialogs

            switch (selection) {
            case 'Submit a problem':
                session.replaceDialog('/submitProblem');
                break;
            case 'Change phone number':
                session.reset('/submitPhone');
                break;
            case 'Change language':
                session.reset('/selectLocale');
                break;
            default:
                session.reset('/');
                break;
            }
        }
    }
]);

bot.dialog('/help', [
    function (session) {
        session.endDialog('HelpMessage');
    }
]);