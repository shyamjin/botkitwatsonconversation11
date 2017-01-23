/*eslint-env node, botkit, nodemailer*/
/**
 * Copyright 2016 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var Botkit = require("botkit");
var nodemailer = require("nodemailer");

var controller = Botkit.facebookbot({
  access_token: process.env.FB_ACCESS_TOKEN,
  verify_token: process.env.FB_VERIFY_TOKEN
});

var bot = controller.spawn();
controller.hears("(.*)", "message_received", function(bot, message) {
	if(message.watsonData.context.customerid || message.watsonData.context.sendmailLiveAgent)
	{
		var transporter = nodemailer.createTransport({
			service: "Gmail",
			auth: {
			    user: "mishraab01@gmail.com",
			    pass: "Amdocs@1"
			}
		});
		if(message.watsonData.context.customerid)
		{
			transporter.sendMail({
		 	   from: "mishraab01@gmail.com",
		    	to: "KrrishXL@amdocs.com",
		    	subject: "Krrish_Mail_Trigger_Demo",
		    	text: "hello world!"
			});
			delete message.watsonData.context.customerid;
		}
		else
		{
			transporter.sendMail({
		 	   from: "mishraab01@gmail.com",
		    	to: "mishraab@amdocs.com,anil.kumar1@amdocs.com",
		    	subject: "Bot flow for Live Agent",
		    	text: "Below is the issue discribed by Customer - " + message.watsonData.context.mailText
			});
			delete message.watsonData.context.sendmailLiveAgent;
		}
		console.log("Send Mail");
	}
	console.log(message.watsonData.context);
	var attachment = String(message.watsonData.output.text);
	if(attachment.indexOf("\"{") === 0)
  	{
  		bot.reply(message, {attachment: JSON.parse(attachment),});
	}
	else
  	{
  		bot.reply(message, message.watsonData.output.text.join("\n"));
  	}
});

module.exports.controller = controller;
module.exports.bot = bot;
