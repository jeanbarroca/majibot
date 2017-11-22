require('dotenv-extended').load();

require('./connectorSetup')();

require('./dialogs/selectLocale')();
require('./dialogs/submitProblem')();
require('./dialogs/submitPhone')();

/*
require('./dialogs/checkProblems.js')();
require('./dialogs/checkMyBill.js')();
*/


// Entry point of the bot
bot.dialog('/', [
    function (session) {
        session.replaceDialog('/submitProblem');
    }
]);

bot.dialog('/promptButtons', [
    (session) => {
        let choices = ['Submit a problem', 'Check problems I\'ve submitted', 'Check my bill'];
        builder.Prompts.choice(session, 'InitialPrompt', choices);
    },
    (session, results) => {
        if (results.response) {
            let selection = results.response.entity;

            // route to corresponding dialogs

            switch (selection) {
            case 'Submit a problem':
                session.replaceDialog('/submitProblem');
                break;
            case 'Check problems I\'ve submitted':
                session.replaceDialog('/checkProblems');
                break;
            case 'Check my bill':
                session.replaceDialog('/checkMyBill');
                break;
            default:
                session.reset('/');
                break;
            }
        }
    }
]);
