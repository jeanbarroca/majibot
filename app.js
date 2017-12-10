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
bot.endConversationAction('goodbye', 'Goodbye :)', { matches: /^bye/i });
bot.beginDialogAction('help', '/help', { matches: /^help/i });

// Entry point of the bot
bot.dialog('/', [
    function (session) {
        session.replaceDialog('/promptButtons');
    }
]);

bot.dialog('/promptButtons', [
    (session, results, next) => {
        let choices = ['Submit', 'Check problems', 'Check bill'];
        builder.Prompts.choice(session, 'InitialPrompt', choices, {'listStyle': 3});
    },
    (session, results, next) => {
        if (results.response) {
            let selection = results.response.entity;

            // route to corresponding dialogs

            switch (selection) {
            case 'Submit':
                session.replaceDialog('/submitProblem');
                break;
            case 'Check problems':
                session.reset('/');
                break;
            case 'Check bill':
                session.reset('/');
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