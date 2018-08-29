/* eslint-disable  func-names */
/* eslint-disable  no-console */

const apiEndpoint = "http://api.eventful.com/json/events/search?app_key=3D8bDCMLCmbx2QtX&keywords=pink+floyd&date=future&category=music&location=miami+florida"
const Alexa = require('ask-sdk-core');
const axios = require('axios');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    let speechText = `Hi, I can give you information on Pink Floyd's upcoming concerts in a specific area. For example you can say "give me the upcoming concerts in Miami, FL"`;

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

const GetUpcomingConcertsIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'GetUpcomingConcertsIntent';
  },
  handle(handlerInput) {
    console.log("in upcoming");
    getConcertsByLocation("Miami, Florida", handlerInput);

    // return handlerInput.responseBuilder
    //   .speak(speechText)
    //   .getResponse();
  }
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can say hello to me!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

function getConcertsByLocation(location, handlerInput) {
  axios.get(apiEndpoint)
    .then(response => {
      console.log("in concerts");
      let eventCount = response.data.total_items
      let speechText = `Found ${eventCount} events`;

      return handlerInput.responseBuilder
        .speak(speechText)
        .getResponse();
    })
    .catch(error => {
      console.log(error);
    });
}


/* ===================
*   Main entry point
*  ===================
*/

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    GetUpcomingConcertsIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
