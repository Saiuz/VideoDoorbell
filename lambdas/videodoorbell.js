/**
 * Created by petermasky on 12/25/17.
 */
'use strict';

const Alexa = require('alexa-sdk');
const AWS = require('aws-sdk');
const APP_ID = 'amzn1.ask.skill.a939eb59-cb2c-41e2-9cf7-5d538ed06aa7';

// Helpers
var buildSpeechletResponse = function(outputText, shouldEndSession){
    return {
        outputSpeech: {
            type: "PlainText",
            text: outputText
        },
        shouldEndSession: shouldEndSession
    }
};
var generateResponse = function(speechletResponse, sessionAttributes){
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    }
};

const handlers = {
    'LaunchRequest': function () {
        // this.emit('GetFact');
    },
    'GetNewFactIntent': function () {
        // this.emit('GetFact');
    },
    'GetFact': function () {
        // Get a random space fact from the space facts list
        // Use this.t() to get corresponding language data
        // const factArr = this.t('FACTS');
        // const factIndex = Math.floor(Math.random() * factArr.length);
        // const randomFact = factArr[factIndex];

        // Create speech output
        // const speechOutput = this.t('GET_FACT_MESSAGE') + randomFact;
        // this.emit(':tellWithCard', speechOutput, this.t('SKILL_NAME'), randomFact);
    },
    'AMAZON.HelpIntent': function () {
        // const speechOutput = this.t('HELP_MESSAGE');
        // const reprompt = this.t('HELP_MESSAGE');
        // this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        // this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        // this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'Unhandled': function () {
        const AWS_IOT_ENDPOINT='a2i24z1epaqm0b.iot.us-east-1.amazonaws.com';
        const iotData = new AWS.IotData({ endpoint: AWS_IOT_ENDPOINT });

        const jsonToRPi=
            {
                "clickType": "SINGLE"

            };

        const params = {
            topic: 'iotbutton/G030MD044215SSU3',
            payload: JSON.stringify(jsonToRPi)
        };
        console.log("Here");

        iotData.publish(params, (err, res) => {
            if (err) return console.log(err);

            console.log(res);

        });

        var docClient = new AWS.DynamoDB.DocumentClient();
        var msg=""

        var db_params = {
            TableName: 'Visitors',
            Key:{
                "field": "visitor"
            }
        };
        docClient.get(db_params, function(err, data) {
            if (err) {
                console.log(err);
            } else {
                console.log(data.Item.guest);
                msg=data.Item.guest;
            }
        });
        // Alexa.utils.emit(':tell', "message is "+msg);
        generateResponse(buildSpeechletResponse(msg, false));


        console.log("exit lambda");
        // return msg;
    }
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};





/**
 * Created by petermasky on 12/25/17.
 */
'use strict';

const Alexa = require('alexa-sdk');
const AWS = require('aws-sdk');
const APP_ID = 'amzn1.ask.skill.a939eb59-cb2c-41e2-9cf7-5d538ed06aa7';

// Helpers
var buildSpeechletResponse = function(outputText, shouldEndSession){
    return {
        outputSpeech: {
            type: "PlainText",
            text: outputText
        },
        shouldEndSession: shouldEndSession
    }
};
var generateResponse = function(speechletResponse, sessionAttributes){
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    }
};

exports.handler = function (event, context) {


    try {
        if (event.session.new) {
            // New Session
            console.log("NEW SESSION")
        }
        switch (event.request.type) {
            case "LaunchRequest":
                // Launch Request
                console.log('LAUNCH REQUEST')
                context.succeed(
                    generateResponse(
                        buildSpeechletResponse("Welcome to an Alexa Skill, this is running on a deployed lambda function", true)
                    )
                );
                break;
            case "IntentRequest":
                // Intent Request
                console.log('INTENT REQUEST');




                const AWS_IOT_ENDPOINT='a2i24z1epaqm0b.iot.us-east-1.amazonaws.com';
                const iotData = new AWS.IotData({ endpoint: AWS_IOT_ENDPOINT });

                const jsonToRPi=
                    {
                        "clickType": "SINGLE"

                    };

                const params = {
                    topic: 'iotbutton/G030MD044215SSU3',
                    payload: JSON.stringify(jsonToRPi)
                };
                console.log("Here");

                iotData.publish(params, (err, res) => {
                    if (err) return console.log(err);

                    console.log(res);

                });

                var docClient = new AWS.DynamoDB.DocumentClient();
                var msg=""

                var db_params = {
                    TableName: 'Visitors',
                    Key:{
                        "field": "visitor"
                    }
                };
                docClient.get(db_params, function(err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(data.Item.guest);
                        msg=data.Item.guest;
                    }
                });
                // Alexa.utils.emit(':tell', "message is "+msg);
                context.succeed(generateResponse(buildSpeechletResponse(msg, false)));


                console.log("exit lambda");
                // return msg;




                break;
            case "SessionEndedRequest":
                // Session Ended Request
                console.log('SESSION ENDED REQUEST');
                break;
            default:
                context.fail('INVALID REQUEST TYPE');
        }
    } catch (error) {
        context.fail('Exception:'+ error);
    }
};


















// 'use strict';

// const Alexa = require('alexa-sdk');
// const AWS = require('aws-sdk');
// const APP_ID = 'amzn1.ask.skill.a939eb59-cb2c-41e2-9cf7-5d538ed06aa7';

// // Helpers
// var buildSpeechletResponse = function(outputText, shouldEndSession){
//     return {
//         outputSpeech: {
//             type: "PlainText",
//             text: outputText
//         },
//         shouldEndSession: shouldEndSession
//     }
// };
// var generateResponse = function(speechletResponse, sessionAttributes){
//     return {
//         version: "1.0",
//         sessionAttributes: sessionAttributes,
//         response: speechletResponse
//     }
// };

// const handlers = {
//     'LaunchRequest': function () {
//         // this.emit('GetFact');
//     },
//     'GetNewFactIntent': function () {
//         // this.emit('GetFact');
//     },
//     'GetFact': function () {
//         // Get a random space fact from the space facts list
//         // Use this.t() to get corresponding language data
//         // const factArr = this.t('FACTS');
//         // const factIndex = Math.floor(Math.random() * factArr.length);
//         // const randomFact = factArr[factIndex];

//         // Create speech output
//         // const speechOutput = this.t('GET_FACT_MESSAGE') + randomFact;
//         // this.emit(':tellWithCard', speechOutput, this.t('SKILL_NAME'), randomFact);
//     },
//     'AMAZON.HelpIntent': function () {
//         // const speechOutput = this.t('HELP_MESSAGE');
//         // const reprompt = this.t('HELP_MESSAGE');
//         // this.emit(':ask', speechOutput, reprompt);
//     },
//     'AMAZON.CancelIntent': function () {
//         // this.emit(':tell', this.t('STOP_MESSAGE'));
//     },
//     'AMAZON.StopIntent': function () {
//         // this.emit(':tell', this.t('STOP_MESSAGE'));
//     },
//     'Unhandled': function () {
//         const AWS_IOT_ENDPOINT='a2i24z1epaqm0b.iot.us-east-1.amazonaws.com';
//         const iotData = new AWS.IotData({ endpoint: AWS_IOT_ENDPOINT });

//         const jsonToRPi=
//         {
//             "clickType": "SINGLE"

//         };

//         const params = {
//             topic: 'iotbutton/G030MD044215SSU3',
//             payload: JSON.stringify(jsonToRPi)
//         };
//         console.log("Here");

//         iotData.publish(params, (err, res) => {
//             if (err) return console.log(err);

//             console.log(res);

//         });

//         var docClient = new AWS.DynamoDB.DocumentClient();
//         var msg=""

//         var db_params = {
//         TableName: 'Visitors',
//         Key:{
//             "field": "visitor"
//             }
//         };
//         docClient.get(db_params, function(err, data) {
//             if (err) {
//                 console.log(err);
//             } else {
//                 console.log(data.Item.guest);
//                 msg=data.Item.guest;
//             }
//         });
//         // Alexa.utils.emit(':tell', "message is "+msg);
//         generateResponse(buildSpeechletResponse(msg, false));


//         console.log("exit lambda");
//         // return msg;
//     }
// };

// exports.handler = function (event, context) {
//     const alexa = Alexa.handler(event, context);
//     alexa.APP_ID = APP_ID;
//     alexa.registerHandlers(handlers);
//     alexa.execute();
// };
