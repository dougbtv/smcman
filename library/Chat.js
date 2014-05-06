module.exports = function(bot, mongoose, db, constants, privates) {

	// the bot (so we can actually, y'know, CHAT. Which is what this module does.)
	this.bot = bot;
	// Our constants.
	this.privates = privates;
	this.constants = constants;
	this.mongoose = mongoose;
	
	
    /*
       ------------------ EXAMPLE ENTRY.
       foo = {
    	identifier: "crank_success",
    	fields: 1,
    	text: "No prob %1, I went ahead and originated a call for you to %2"
    	};
     */
    
    // Go ahead and define our ORM schema etc.

	this.chatSchema = this.mongoose.Schema({
		identifier: String,
		fields: Number,
		text: String
	}, { collection: 'chat' });
	this.Chat = this.mongoose.model('Chat', this.chatSchema);
	
    
    
    // Now, let's create a method to "say" something to a channel.
    this.say = function(identifier,parameters) {
    	
    	// Ok, so let's count the parameters.
    	// console.log(parameters.length);
    	
    	// Now that we know it's length, let's get an appropriate item from mongo.
		this.Chat.find({ identifier: identifier, fields: parameters.length},function (err, chat) {
			if (err) {
				console.log('that didnt work',err);
			} else {
			
				// Ok, how many results do we have?
				if (chat.length) {
				
					// Pick a random line out of that.
					line = chat[this.randomId(chat.length)];
					
					// Now go and replace it's symbols with our parameters..
					output = line.text;
					for (var i=0; i<parameters.length; i++) {
						// console.log("the eye",i);
						symbolid = i+1;
						re = new RegExp("%" + symbolid);
						// console.log(re);
						// console.log(parameters[i]);
						output = output.replace(re,parameters[i]);
					}
				
					// Finally, say it through IRC.
					this.ircSay(output);
					
				} else {
					
					this.ircSay("That's an error. I'm saying a generic thing, because I can't find what I'm supposed to specifically say. I'll slap myself about with a trout. [identifier: " + identifier + "]");
					
				}
				
			}
		}.bind(this));
    	
    };
    
    // Give me a random number based on the number elements in an array.
    
    this.randomId = function(max) {
    	
    	// Account for the fact it's zero based.
    	max--;
    	// Our minimum is always zero (first array element)
    	min = 0;
    	// Now just go and get a random number in that range.
    	return Math.floor(Math.random() * (max - min + 1)) + min;
    	
    };
    
    this.ircSay = function(message) {
    	
    	if (this.privates.IRC_ENABLED) {
    		this.bot.say(this.privates.IRC_CHANNEL, message);
    	} else {
    		console.log('bot would have said:',message);
    	}
		
    };
	
};
