module.exports = function(smcman, bot, chat, mongoose, db, constants, privates) {

	// Setup a schema.
	var userSchema = mongoose.Schema({

		nick: String,			// Who's this person?
		secret: String,			// The secret key
		indate: Date,			// Created @
		timezone: String,		// What's their timezone pref?

	}, { collection: 'users' });

	// sample virtual.
	/*
	userSchema.virtual('upload_url')
		.get(function () {
			return privates.URL_SMCSITE + "#/upload?key=" + this.secret;
		});
	*/

	// Compile it to a model.
	var User = mongoose.model('User', userSchema);

	console.log("!trace USER INSTANTIATED.");


	// This is the !identify command.
	// It serves the purpose of:
	// 1. new user registration.
	// 2. password reset.
	this.identify = function(from) {

		// We can only do this for registered users.
		smcman.isRegistered(from,function(status){

			if (status) {

				// Ok that's good.
				this.exists(from,function(exists){

					if (exists) {

						// Update them.
						this.updateSecret(from,function(secret){

							chat.whisper(from,"identify_updated",[from,secret]);

						}.bind(this));

					} else {
						// Create them.
						this.createUser(from,function(secret){

							chat.whisper(from,"identify_created",[from,secret]);

						}.bind(this));

					}

				}.bind(this));

			} else {

				chat.say("identify_notregistered",[from]);

			}

		}.bind(this));

	}

	this.exists = function(from,callback) {

		User.findOne({nick: from},function(err,user){

			if (user) {
				callback(true);
			} else {
				callback(false);
			}

		});

	}

	this.createUser = function(from,callback) {

		var user = new User();

		var secret = smcman.createHash(from);

		user.nick = from;
		user.secret = secret;
		user.indate = new Date;
		user.save();

		callback(secret);


	}

	this.updateSecret = function(from,callback) {

		User.findOne({nick: from},function(err,user){

			var secret = smcman.createHash(from);
			user.secret = secret;
			user.save();

			callback(secret);

		});

	}


}