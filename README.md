# majibot - a Facebook Messenger Bot to submit Open311 problem

![npm](https://img.shields.io/npm/v/majibot.svg) ![license](https://img.shields.io/npm/l/majibot.svg) ![github-issues](https://img.shields.io/github/issues/jeanbarroca/majibot.svg)

Chatbot for Open311 // Made in Tanzania

![nodei.co](https://nodei.co/npm/majibot.png?downloads=true&downloadRank=true&stars=true)

![travis-status](https://img.shields.io/travis/jeanbarroca/majibot.svg)
![stars](https://img.shields.io/github/stars/jeanbarroca/majibot.svg)
![forks](https://img.shields.io/github/forks/jeanbarroca/majibot.svg)

![forks](https://img.shields.io/github/forks/jeanbarroca/majibot.svg)

![](https://david-dm.org/jeanbarroca/majibot/status.svg)
![](https://david-dm.org/jeanbarroca/majibot/dev-status.svg)

## Features
- Facebook Messenger Bot
- Allows citizens to submit reports to an Open311-compliant server using a bot
- Gets user location using Facebook Messenger's quick reply button
- Adaptable to other languages, just need to translate locale/en/index.json file


## Install

- Clone this repo

- Run npm install 
`npm install --save majibot`

- Register a bot @ Ms Bot Framework

- Configure env variables
`cp .env_default .env`

- Test locally
`nodemon app.js`

- You can test locally with ngrok, find more instructions here:


## Scripts

 - **npm run start** : `node app.js`
 - **npm run test** : `echo "Error: no test specified" && exit 1`
 - **npm run readme** : `node ./node_modules/.bin/node-readme`

## Dependencies

Package | Version | Dev
--- |:---:|:---:
[botbuilder](https://www.npmjs.com/package/botbuilder) | ^3.12.0 | ✖
[botbuilder-quickreplies](https://www.npmjs.com/package/botbuilder-quickreplies) | ^1.1.1 | ✖
[dotenv-extended](https://www.npmjs.com/package/dotenv-extended) | ^2.0.1 | ✖
[request](https://www.npmjs.com/package/request) | ^2.83.0 | ✖
[restify](https://www.npmjs.com/package/restify) | ^6.3.4 | ✖
[node-readme](https://www.npmjs.com/package/node-readme) | ^0.1.9 | ✔


## Contributing

Contributions welcome; Please submit all pull requests the against developer branch. 

Thanks!

## Authors

Jean Barroca

Lally Elias

## License

 - **MIT** : http://opensource.org/licenses/MIT
