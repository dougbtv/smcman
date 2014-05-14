module.exports = function(smcman, bot, chat, mongoose, db, constants, privates) {

	this.cointoss = function(from) {
		var coin_string; //we will set this up in the conditional
		var coin = Math.floor(Math.random()*2) //Alternate between zero and one
		if(coin) { coin_string  = "heads"; } else { coin_string = "tails"; } //if coin is set to true or false, set the coin_string as said
		chat.say("cointoss", [from, coin_string]);
	}
	
	this.rolldice = function(from) { //Will come back to this one
		
	}
	
	this.smokeup = function(from) {
		chat.action("smokeup",[from]);
	}
	
	this.fart = function(from) {
	
	}
	
	this.beer = function(from) {
	
	}
	
	this.hug = function(from) {
	
	}
	
	this.slap = function(from) {
	
	}
	
	this.insult = function(from) {
	
	}
	
	this.chuck = function(from) { //this is throw but since throw is a JavaScript function we better not use it here!
	
	}
	
	this.kill = function(from) {
	
	}
	
};