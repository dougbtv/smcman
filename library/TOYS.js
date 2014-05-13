module.exports = function(smcman, bot, chat, mongoose, db, constants, privates) {
/*	
	this.cointoss = function(from) {
	
		//var coin = int(2);
			var coin = Math.floor(Math.random(2));
		if(coin) { coin = "heads"; } else { coin = "tails"; } 
		
		var ars = [from]+[coin];
		
		chat.say("cointoss", [ars]);
	}
*/

	this.cointoss = function(from) {
		var coin_string; //we will set this up in the conditional
		var coin = Math.floor(Math.random()*2) //Alternate between zero and one
		if(coin) { coin_string  = "heads"; } else { coin_string = "tails"; } //if coin is set to true or false, set the coin_string as said
		chat.say("cointoss", [from, coin_string]);
	}
	
	};