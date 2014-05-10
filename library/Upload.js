module.exports = function(smcman, bot, chat, mongoose, db, constants, privates) {

	// We use MD5 for IDS.
	var md5 = require('MD5');
	var moment = require('moment');

	// And we salt it.
	var salt = "d000nTRiN<|ket";

	// Setup a schema.
	var uploadSchema = mongoose.Schema({

		nick: String,			// Who's uploading?
		secret: String,			// The secret key
		file: String,			// File pointer.
		indate: Date,			// Date of upload
		is_smc: Boolean,		// Is this for an SMC?
		description: String,	// A description.
		category: String,		// (Unused?) A category. 

	}, { collection: 'uploads' });

	// Compile it to a model.
	var Upload = mongoose.model('Upload', uploadSchema);

	this.newUpload = function(from) {

		// Now we want an instance of it.
		var upload = new Upload;

		// Create a secret key.
		var key = this.createHash(from);


		console.log("!trace UPLOAD HERE.");

	}

	this.createHash = function(from) {

		var unixtime = moment().format("X");
		var txt = from + unixtime.toString() +  (Math.floor(Math.random() * (2500 - 1 + 1)) + 1).toString() + salt;

		var hash = md5(txt);

		console.log("!trace hash text: ",txt);
		console.log("!trace hash out: ",hash);

		return hash;

	}

}