'use strict';

require('dotenv').config()
const APIAI_TOKEN = process.env.APIAI_TOKEN;
const { Carousel , BasicCard  ,SimpleResponse  } = require('actions-on-google');
const APIAI_SESSION_ID = process.env.APIAI_SESSION_ID;
const { WebhookClient , Payload ,  Card ,  Suggestion , Image } = require('dialogflow-fulfillment');
const gender = require('gender-detection');
const dialogflow = require('dialogflow');
const express = require('express');
const app = express();

app.use(express.static(__dirname + '/views')); // html
app.use(express.static(__dirname + '/public')); // js, css, images

const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

const io = require('socket.io')(server);
io.on('connection', function(socket){
  console.log('a user connected');
});

const apiai = require('apiai')(APIAI_TOKEN);

// Web UI
app.get('/', (req, res) => {
  res.sendFile('index.html');
});


io.on('connection', function(socket) {
  socket.on('chat message', (text) => {
    console.log('Message: ' + text);

    // Get a reply from API.ai

    let apiaiReq = apiai.textRequest(text, {
      sessionId: APIAI_SESSION_ID
    });

    apiaiReq.on('response', (response) => {
      console.log(response.result.fulfillment.messages[2].buttons);
     for (let pas = 0; pas < response.result.fulfillment.messages.length ; pas++) {
      if (response.result.fulfillment.messages[pas].type === 0){

      console.log('Bot reply: ' + response.result.fulfillment.messages[pas].speech);
      socket.emit('bot reply', response.result.fulfillment.messages[pas].speech);
    }
    else if (response.result.fulfillment.messages[pas].type === 1)
    {
     console.log('Bot reply: ' + response.result.fulfillment.messages[pas].buttons[0].postback);
      socket.emit('bot reply', response.result.fulfillment.messages[pas].buttons[0].postback);	
    }
    }
      //console.log(response);
    });

    apiaiReq.on('error', (error) => {
      console.log(error);
    });

    apiaiReq.end();

  });
});
