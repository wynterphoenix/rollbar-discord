const express = require('express');
const app = express();
const config = require('./config.json');
const configFile = './config.json';
const bodyParser = require('body-parser');
const randomToken = require('random-token');
const fs = require('fs');
const request = require('request');

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/setup', (req, res) => {
	if(config.token == ""){
		var token = randomToken(16);
		config.token = token;
		fs.writeFile(configFile, JSON.stringify(config), function (err) {
  			if (err) return console.log(err);
		 	console.log(JSON.stringify(config));
		});
		res.status(200).json({error: 'false', message:'success'});
	}
	else res.status(500).json({error: 'true', message:'Token already set!'});
});

app.post('/:token', (req, res) => {
	if(req.params.token === config.token){
		console.log(req.body);
		var rb = req.body;
    var emoji = {
      resolved_item: "\u2705",
      new_item: "\u26A0",
      reactivated_item: "\u26A0",
      reopened_item: "\u26A0"
    }
		var title = rb.event_name.replace("_", " ");
    //console.log(rb.data.item.last_occurrence);
    var embed = {
        username: "Rollbar-Discord",
        avatar_url: 'https://cdn.rollbar.com/static/img2/rollbar-icon-white.png?ts=1502917159v8',
        embeds: [
          {
            title: emoji[rb.event_name]+ " " + title,
            type: "rich",
            description: rb.data.item.title,
            color: 16711680,
            thumbnail: {url: 'https://cdn.rollbar.com/static/img2/rollbar-icon-white.png?ts=1502917159v8'},
            url: "https://rollbar.com/item/uuid/?uuid=" + rb.data.item.last_occurrence.uuid,
            provider:{name: "Rollbar", url:"https://rollbar.com"},
            fields: [
              {
                name: "Environment",
                value: rb.data.item.environment,
                inline: false
              }
            ]
          }
        ]
      };
    console.log(embed);
    //request('https://discordapp.com/api/webhooks/529208570978238474/agSydj02-2N89PDJikUG6lkEV0cPLni2pRIQ2_bdG3a_uTJwIKrEMO6ARpByFoBjmEg2', {form: embed}, function(err, res, body) {console.log(body)})
    var options = {
      url: config.discordWebhook,
      method: 'POST',
      json: true,
      body: embed
    }
		request(options, function(error, response, body) {
        //console.log(res);
        //console.log(body);
      });
		res.sendStatus(200);
	}
	else {
		res.status(401).json({error: 'true', message: 'invalid token'});
	}
});

app.listen(80)
console.log('Listening.......');
