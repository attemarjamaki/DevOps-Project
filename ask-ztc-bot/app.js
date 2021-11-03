
const { App } = require("@slack/bolt");
require("dotenv").config();
const Slack = require('slack');
var XMLHttpRequest = require('xhr2');
var xhr = new XMLHttpRequest();
// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode:true,
  appToken: process.env.APP_TOKEN

});

app.command("/test", async ({ command, ack, say }) => {
  try {
    await ack();
    say("Testing testing 1 2 3");
  } catch (error) {
      console.log("err")
    console.error(error);
  }
});

app.command("/weather", async ({ command, ack, say }) => {
  

  try {
    await ack();

    function loadWeather() {
      xhr.open("GET", "https://api.openweathermap.org/data/2.5/weather?q=Helsinki,fi&appid=b883e38ea5bc2725e3338c15a66686a0&units=metric");
      xhr.onload = function(){
        var ourData = JSON.parse(xhr.responseText);
        console.log(Math.round(ourData.main.temp) +"°C " + ourData.weather[0].description);
      }
      xhr.send();
    }
  
    loadWeather();

    say(Math.round(ourData.main.temp) +"°C " + ourData.weather[0].description);
  } catch (error) {
      console.log("err")
    console.error(error);
  }
});

module.exports.run = async (data) => {
  const dataObject = JSON.parse(data.body);

  let response = {
    statusCode: 200,
    body: {},
    headers: { 'X-Slack-No-Retry': 1 }
  }
  try {
      switch (dataObject.type) {
        case 'url_verification':
          response.body = verifyCall(dataObject);
          break;

    }
  }
  catch (err) {

  }
  finally {
    return response;
  }
}

function verifyCall(data) {
  if (data.token == process.env.VERIFICATION_TOKEN){
    return data.challenge;
  } 
  else {
    throw 'vertification failed';
  }
}

(async () => {
  const port = 4040
  // Start your app
  await app.start(process.env.PORT || port);
  console.log(`⚡️ Slack Bolt app is running on port ${port}!`);
})();


