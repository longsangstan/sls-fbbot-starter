
const axios = require("axios");

const VERIFY_TOKEN = require("./config").VERIFY_TOKEN;
const ACCESS_TOKEN = require("./config").ACCESS_TOKEN;

// Your first function handler
module.exports.webhook = (event, context, callback) => {
    console.log("webhook!!!" + JSON.stringify(event));

    if (event.httpMethod === "GET") {
        console.log("GET!!!");

        // process GET request
        if (event.queryStringParameters) {
            console.log(
                "queryStringParameters: " +
                    JSON.stringify(event.queryStringParameters)
            );

            var queryParams = event.queryStringParameters;

            var rVerifyToken = queryParams["hub.verify_token"];

            if (rVerifyToken === VERIFY_TOKEN) {
                var challenge = queryParams["hub.challenge"];

                var response = {
                    body: parseInt(challenge),
                    statusCode: 200
                };

                callback(null, response);
            } else {
                console.log("error!!!");

                var response = {
                    body: "Error, wrong validation token",
                    statusCode: 422
                };

                callback(null, response);
            }
        }
    }

    if (event.httpMethod === "POST") {
        console.log("POST!!!");

        console.log("body: " + event.body);

        var data = JSON.parse(event.body);

        data.entry.map(entry => {
            entry.messaging.map(messagingItem => {
                if (messagingItem.message) {
                    const quotes = [
                        "Don't cry because it's over, smile because it happened. - Dr. Seuss",
                        "Be yourself; everyone else is already taken. - Oscar Wilde",
                        "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe. - Albert Einstein",
                        "Be who you are and say what you feel, because those who mind don't matter, and those who matter don't mind. - Bernard M. Baruch",
                        "So many books, so little time. - Frank Zappa",
                        "A room without books is like a body without a soul. - Marcus Tullius Cicero"
                    ];

                    const randomQuote =
                        quotes[Math.floor(Math.random() * quotes.length)];

                    const payload = {
                        recipient: {
                            id: messagingItem.sender.id
                        },
                        message: {
                            text: randomQuote
                        }
                    };

                    const url = `https://graph.facebook.com/v2.6/me/messages?access_token=${ACCESS_TOKEN}`;
                    axios.post(url, payload).then(() => {
                        var response = {
                            body: "ok",
                            statusCode: 200
                        };

                        callback(null, response);
                    });
                }
            });
        });
    }
};
