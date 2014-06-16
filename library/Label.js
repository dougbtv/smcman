module.exports = function(smcman, bot, chat, mongoose, db, constants, privates) {

	// Setup a schema.
	var labelSchema = mongoose.Schema({

		nick: String,			// Who's this person?
		label: String,			// What's the label?

	}, { collection: 'labels' });

	// Compile it to a model.
	var Label = mongoose.model('Label', labelSchema);

	this.getLabels = function(nick,callback) {

		// console.log("Which nick?");

		Label.find({nick: nick},function(err,labels){

			// Make a plain list of labels.
			var list = [];

			for (var i = 0; i < labels.length; i++) {
				list.push(labels[i].label);
			}

			callback(list);

		});

	}

}