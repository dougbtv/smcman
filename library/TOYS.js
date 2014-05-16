module.exports = function(smcman, bot, chat, mongoose, db, constants, privates) {

	this.cointoss = function(from) {
		var coin_string; //we will set this up in the conditional
		var coin = Math.floor(Math.random()*2) //Alternate between zero and one
		if(coin) { coin_string  = "heads"; } else { coin_string = "tails"; } //if coin is set to true or false, set the coin_string as said
		chat.say("cointoss", [from, coin_string]);
	}
	
	this.rolldice = function(from) { //Will come back to this one
		
	}
	
	//WIP still need to work on the others and get null arg's going
	this.smokeup = function(command) {
	//	var arg1 = command.arglist[0];
	//	var arg2 = command.arglist[1];
		chat.action("smokeup", [command.arglist[0], command.arglist[1]]);
	}
	
	this.fart = function(command, from) {
		var arg1 = command.arglist[0];
		chat.action("fart", [arg1]);
	}
	
	this.beer = function() {
	
	}
	
	this.hug = function() {
	
	}
	
	this.slap = function() {
	
	}
	
	this.insult = function() {
	
	}
	
	this.chuck = function() { //this is throw but since throw is a JavaScript function we better not use it here!
	
	}
	
	this.kill = function() {
	
	}
	
};