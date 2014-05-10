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

	// Setup rest, with an instance, and a server instance.
	var restify = require('restify');
	var RestServer = require('./restServer.js');
	var server = restify.createServer();
	server.use(restify.bodyParser());


	// Set our properties from the arguments upon instantiation.
	this.bot = bot;
	this.constants = constants;
	this.privates = privates;
	this.mongoose = mongoose;
	this.db = db;
	this.rest = new RestServer(server,this,this.bot,this.chat,this.mongoose,this.db,this.constants,this.privates);

	// We'll create our admin schema so we only do it once.
	// Setup our schemas.
	var adminSchema = this.mongoose.Schema({
		nick: String,
		is_dev: Boolean,
	}, { collection: 'admins' });
	
	// Compile it to a model.
	var Admin = this.mongoose.model('Admin', adminSchema);
	
	// We have a "Chat" object which uses mongo to make for a data-driven "chat" from this bot.
	Chat = require("./Chat.js");
	this.chat = new Chat(this.bot,this.mongoose,this.db,this.constants,this.privates);
	
	// This is an object which handles the delivery and storage of "notes" (messages to users for the next time they speak)
	Note = require("./Note.js");
	this.note = new Note(this.bot,this.chat,this.mongoose,this.db,this.constants,this.privates);
	
	// Here's a dispatcher for notices. We're using it for a nick & a callback.
	this.isRegisteredCallback = null;

	// We have an object to describe an SMC itself.
	var SMC = require("./SMC.js");       // The object describing an SMC itself.
	var smc = new SMC(this,this.bot,this.chat,this.mongoose,this.db,this.constants,this.privates);

	// Our upload module
	var Upload = require("./Upload.js");       // The object describing an upload
	// Ok, create a new upload instance.
	this.upload = new Upload(this,this.bot,this.chat,this.mongoose,this.db,this.constants,this.privates);
						
	
	// Start a REST server.
	if (privates.REST_API_ENABLED) {
		this.rest.serverStart();
	}

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
					case "imin":        smc.joinSMC(from);  		break;
					
					case "cancel":
					case "admincancel": smc.cancelSMC(from); 		break;

					case "out":
					case "imout":
					case "forfeit": 	smc.forfeitSMC(from); 		break;
						break;

					case "trace": 		smc.traceIt(from);			break;

					// ---------------------------------------------------------
					// -- Uploads!
					// ---------------------------------------------------------
					
					case "upload": 	
						// And we'll create a new upload
						this.upload.newUpload(from);
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

	this.isAdmin = function(in_nick,callback) {

		// Ok, first we're going to look for them in mongo.
		Admin.count({ nick: in_nick }, function (err, count) {
			if (count) {

				// They're listed as an admin.
				// But, are they registered?
				this.isRegistered(in_nick,function(registered_status){
					// Call it back with the registered status.
					callback(registered_status);
				});

			} else {
				// They're not an admin. We just return false to the callback.
				callback(false);
			}

		}.bind(this));

		// If they're in mongo, we'll check if they're registered.


	}

	this.isRegistered = function(nick,callback) {

		// So first we check and see if they're registered. Which we have to handle via a dispatcher.
		// We have two disparate events, which is kind of tricky.
		this.isRegisteredCallback = function(intext) {

			// Go and break up the intext by spaces, and the third element is the ACC status.
			// A status of "3" means logged in.
			// http://stackoverflow.com/questions/1682920/determine-if-a-user-is-idented-on-irc
			var parts = intext.split(" ");
			var acc_status = parseInt(parts[2]);

			var is_registered = false;
			if (acc_status == 3) {
				is_registered = true;
			}

			// Ok, we'll get this after we send and ACC to nickserv.
			callback(is_registered);

		}; 

		// Next, we send a ACC to nickserv, which tells us if they're registered.
		this.bot.say("nickserv", "acc " + nick);


	}

	this.noticeHandler = function(text,from) {

		// So we got a notice.
		switch(from) {

			case "NickServ":
				console.log("!trace -- NOTICE NICKSERV: " + from + " / text: " + text);
				// Check if it's a registration request.
				if (text.match(/^.+\sACC/)) {
					// That's a registration request.
					if (this.isRegisteredCallback) {
						this.isRegisteredCallback(text);
					}
				} else {
					// Other things you'd do here.
				}
				break;

			default:
				console.log("!trace -- NOTICE from: " + from + " / text: " + text);
				break;

		}

	}
   
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
