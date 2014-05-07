// ------------------------------------------- -
// ----- SMCMAN - the guts of the bot. ---- -
// ----------------------------------------- -

module.exports = function(bot, mongoose, db, constants, privates) {
	
	// Include the filesystem module.
	this.fs = require('fs');
	// And we want a synchronous exec.
	this.execSync = require("exec-sync");
	// We'll want the request module, so we can fetch from a pastebin
	this.request = require("request");

	// Set our properties from the arguments upon instantiation.
	this.bot = bot;
	this.constants = constants;
	this.privates = privates;
	this.mongoose = mongoose;
	this.db = db;
	
	// We have a "Chat" object which uses mongo to make for a data-driven "chat" from this bot.
	Chat = require("./Chat.js");
	this.chat = new Chat(this.bot,this.mongoose,this.db,this.constants,this.privates);
	
	// This is an object which handles the delivery and storage of "notes" (messages to users for the next time they speak)
	Note = require("./Note.js");
	this.note = new Note(this.bot,this.chat,this.mongoose,this.db,this.constants,this.privates);
	
	// We have an object to describe an SMC itself.
	var SMC = require("./SMC.js");       // The object describing an SMC itself.
	var smc = new SMC(this.bot,this.chat,this.mongoose,this.db,this.constants,this.privates);
	
	
	// --------------------------------------------------------- Handle command.
	this.commandHandler = function(text,from) {
		
		// Ok, so, this is where we'll fire off the note handler (which checks to see if there's a "note" for someone.
		this.note.handler(from);

		// Now let's see if someone dinged us, we'll respond as a clever bot if that is the case.
		namedetect = new RegExp("^" + privates.IRC_BOTNAME,'i');
		if (namedetect.test(text)) {

			// !bang
			// Now strip out the bot's name. So we get the raw text.
			namestrip = new RegExp("^" + privates.IRC_BOTNAME + "\\W+(.+)$",'i');
			strippedtext = text.replace(namestrip,'$1');

			// !cleverbotremoved

		} else {
			
			// Then we move onto literal commands.
			
			command = this.parseCommand(text,from);
			if (command !== false) {
				console.log(command);
				switch(command.command) {
				
					case "":
						// This happens when someone just speaks a "!" only in a single line, which happens on IRC more than one might think!
						break;

					case "help":
						// Ask for some help.
						this.chat.say("help",[]);
						break;
						
					// ---------------------------------------------------------
					// -- SMC commands.
					// ---------------------------------------------------------
					
					case "smc": 		smc.startSMC(command,from); break;
					
					case "in":
					case "join":
					case "imin":        smc.joinSMC();  break;
					
					case "cancel":
					case "admincancel": smc.cancelSMC(command,from); break;

					case "out":
					case "imout":
					case "forfeit":
						break;

					// ---------------------------------------------------------
					// -- Note command(s)
					// ---------------------------------------------------------
					
					case "note":
						// Leave a note for someone to read the next time they speak.
						this.note.leaveAMessage(from,command.args);
						break;
						
					default:
						// Otherwise, we don't know what the heck.
						this.chat.say("command_unknown",[from,command.command]);
						break;
				
				}

			}

		}
		
	};
   
	// --------------------------------------------------------- Parse a command.
	this.parseCommand = function(text,from) {
		
		// Trim down the text, first.
		var text = text.trim();
		
		if (/^!/.test(text)) {
			// Ok this is a command. 
			// Let's see if it has arguments.
			if (/^!\w+\s.+$/.test(text)) {
				// It has arguments. Let's get the parts.
				command = text.replace(/^!(.+?)\s.+$/,'$1');
				args = text.replace(/^!.+?\s(.+)$/,'$1');
			} else {
				// It's a bareword command. Just take the bareword (and leave args empty)
				command = text.replace(/^!(.+)?/,'$1');
				args = "";
			}
			
			var arglist = args.match(/(?:[^\s"]+|"[^"]*")+/g) ;
			// cycle through all the args.

			// Log my parts for debugging (temporarily)
			if (this.privates.IRC_DEBUG) {
				console.log("raw",text);
				console.log("command",command);
				console.log("args",args);
			}
			
			return {
				command: command,
				args: args,
				arglist: arglist
			};
			
			
		} else {
			// This is not a command.
			return false;
		}
		
	};
	
	// ---------------------------------------------------------- Say something to the room.
	this.say = function(message) {
		
		this.bot.say(this.privates.IRC_CHANNEL, message);
		
	};
	
	

	
	
};
