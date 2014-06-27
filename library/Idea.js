module.exports = function(bot, chat, mongoose, db, constants, privates) {

	// Setup a schema.
	this.ideaSchema = this.mongoose.Schema({
		idea: String,
		nick: String,
		indate: Date
	}, { collection: 'ideas' });
	
	// Compile it to a model.
	this.idea = this.mongoose.model('idea', this.ideaSchema);

	
	

}