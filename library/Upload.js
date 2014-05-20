module.exports = function(smcman, bot, chat, mongoose, db, constants, privates) {

	// We remove old files after so long.
	var schedule = require('node-schedule');
	var moment = require('moment');
	// We move files into place when uploaded.
	var fs = require("fs");

	// Setup a schema.
	var uploadSchema = mongoose.Schema({

		nick: String,			// Who's uploading?
		secret: String,			// The secret key
		file: String,			// File pointer.
		mime_type: String,		// The mime type.
		indate: Date,			// Date of upload
		is_smc: Boolean,		// Is this for an SMC?
		description: String,	// A description.
		category: String,		// (Unused?) A category.
		complete: Boolean, 		// Is the upload complete?
		tiny_url: Number,		// What's it's tiny url ID?
		deleted: Boolean,		// Is this removed?

	}, { collection: 'uploads' });

	// The URL to upload to.
	uploadSchema.virtual('upload_url')
		.get(function () {
			return privates.URL_SMCSITE + "#/upload?key=" + this.secret;
		});

	// The final URL
	uploadSchema.virtual('url')
		.get(function () {
			// Our URL consists of:
			// http://DOMAIN/api/view/SSSXXXX
			// http://DOMAIN is straight forward
			// api/view is our path
			// SSS is the first three characters of our secret.
			// XXXX is the hex value of the tiny url
			return privates.URL_SMCSITE + "view/" + this.secret.substring(0,3) + this.tiny_url.toString(16);
		});


	uploadSchema.virtual('filepath')
		.get(function () {
			return constants.PATH_UPLOAD_STORAGE + this.secret;
		});

	// Compile it to a model.
	var Upload = mongoose.model('Upload', uploadSchema);

	// We also keep an incrementing ID for tiny URLs
	// so we have a small schema for that.
	var counterSchema = mongoose.Schema({
		seq: Number,			
	}, { collection: 'counters' });
	var Counter = mongoose.model('Counter', counterSchema);

	this.newUpload = function(from,is_smc) {

		// REMOVED.
		// Might be nice in the future, but, it's spammy during an SMC.
		// check if they're registered.
		// smcman.isRegistered(from,function(status){}.bind(this));
		// // Let them know they have to register, in that case.
		// // chat.say("upload_not_registered",[from]);


		// Good we can upload.
		// By default, it's not from an SMC.
		if (typeof is_smc == 'undefined') { is_smc = false;	}

		// Now we want an instance of it.
		var upload = new Upload;

		// Create a secret key.
		var key = smcman.createHash(from);

		// Now assign the data to the doc.
		upload.nick = from;
		upload.secret = key;
		upload.indate = new Date();
		upload.is_smc = is_smc;

		console.log("!trace new Upload doc: %j",upload);

		// Get an upload URL, and then whisper it to the requestor.
		chat.whisper(from,"upload_url",[from,upload.upload_url]);

		// Now we can save that.
		upload.save();

		var starting_moment = new moment();
		starting_moment.add('minutes',constants.UPLOAD_TIME_LIMIT);
		
		// Now create a job to check this in 20 minutes.
		schedule.scheduleJob(starting_moment.toDate(), function(){

			this.expireUpload(key);

		}.bind(this));

		console.log("!trace scheduled job.");

	}.bind(this);

	// Create new incremental tiny URLs using an ID
	// idea for incrementing ID from mongo docs: http://docs.mongodb.org/manual/tutorial/create-an-auto-incrementing-field/
	this.newTinyURL = function(callback) {

		var conditions = { for_collection: 'uploads' }
			, update = { $inc: { seq: 1 }}
			, options = {  };

		// Find the current sequence.
		Counter.findOne(conditions,function(err,counter){

			// Keep that sequence ID
			var current_seq = counter.seq;

			// Now update, and increment the value.
			Counter.update(conditions, update, options, function(){
				callback(current_seq);
			});

		});


	}

	this.getUploadByURL = function(tinyurl,callback) {

		var secretpart = tinyurl.substring(0,3);
		var tinyid = parseInt(tinyurl.substring(3),16);

		re_secret = new RegExp('^' + secretpart);

		var conditions = { tiny_url: tinyid, secret: re_secret };

		// Now find it.
		Upload.findOne(conditions,function (err, upload) {

			if (upload) {

				// Great, we can ship back the information we need.
				callback(null,upload.filepath,upload.mime_type);

			} else {

				// That's an error.
				callback("No file found");

			}

		});

	}

	// We expire uploads that don't complete within 20 minutes.

	this.expireUpload = function(key) {

		Upload.find({ secret: key },function (err, uploadset) {

			var upload = uploadset[0];

			// If it didn't complete in this long, remove it.
			if (!upload.complete) {
				console.log("!trace -- REMOVING EXPIRED FILE: ",upload._id);
				Upload.remove({ _id: upload._id },function(err){});
			}

		});

	}

	// Move an uploaded item into storage.

	this.storeUpload = function(key,path,type,filename,callback) {

		var err = "";

		Upload.find({ secret: key },function (err, uploadset) {

			var upload = uploadset[0];

			Upload.findById(upload._id, function (err, upload) {
				if (err) return new Error("Couldn't find it. !a01d7");

				// Do we accept this type? Check our allowed array.
				if (constants.ALLOWED_TYPES.indexOf(type) > -1) {

					// Move the file into place.					
					fs.rename(path, upload.filepath,function(){

						// Get a new tinyURL for it.
						this.newTinyURL(function(tiny_id){

							// Now we can complete this guy.
							upload.complete = true;				// Say it's complete
							upload.tiny_url = tiny_id;			// Give it a "tiny url" increment.
							upload.description = filename;		// Set it's filename as the description.
							upload.mime_type = type;			// Save that mime type.

							upload.save();

							// Let the channel know about it.
							chat.say("upload_tellchannel",[upload.nick,upload.url]);

							// Let the SMC module know about it, if it's for an SMC.
							if (upload.is_smc) {
								smcman.smc.userUploadEvent(upload.nick,upload.url);
							}

							// Callback, no error.
							// Also include the URL.
							callback(false,upload.url);

						});


					}.bind(this));

				} else {
					callback("File type " + type + " is not an allowed type to upload");

				}
			}.bind(this));

		}.bind(this));


		// this.Chat.find({ identifier: identifier, fields: parameters.length},function (err, chat) {

		// Check that out.

		// That's great. Now we can process the uploaded file.

		// Move it into place.

		// And save the new information about this file.

		/*

		
		*/

	}

	this.isUploadVerified = function(key,callback) {

		console.log("!trace upload module, verify key: ",key);

		// Ok, pull that out of the database.
		Upload.count({secret: key}, function(err, counted) {

			// If it's there, that's good.
			if (counted > 0) {

				Upload.findOne({ secret: key },function (err, upload) {

					// But it's only verified if it's incomplete
					if (!upload.complete) {
						callback(true);
					} else {
						callback(false);
					}

				});
				
			} else {
				callback(false);
			}

		});

	}

	

}