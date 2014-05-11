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
		indate: Date,			// Date of upload
		is_smc: Boolean,		// Is this for an SMC?
		description: String,	// A description.
		category: String,		// (Unused?) A category. 
		complete: Boolean, 		// Is the upload complete?
		deleted: Boolean,		// Is this removed?

	}, { collection: 'uploads' });

	// The URL to upload to.
	uploadSchema.virtual('url')
		.get(function () {
			return privates.URL_SMCSITE + "#/upload?key=" + this.secret;
		});

	uploadSchema.virtual('filepath')
		.get(function () {
			return constants.PATH_UPLOAD_STORAGE + this.secret;
		});


	// Compile it to a model.
	var Upload = mongoose.model('Upload', uploadSchema);

	this.newUpload = function(from,is_smc) {

		// check if they're registered.
		smcman.isRegistered(from,function(status){

			if (status) {
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
				chat.whisper(from,"upload_url",[from,upload.url]);

				// Now we can save that.
				upload.save();

				var starting_moment = new moment();
				starting_moment.add('minutes',constants.UPLOAD_TIME_LIMIT);
				
				// Now create a job to check this in 20 minutes.
				schedule.scheduleJob(starting_moment.toDate(), function(){

					this.expireUpload(key);

				}.bind(this));

				console.log("!trace scheduled job.");

			} else {

				// Let them know they have to register.
				chat.say("upload_not_registered",[from]);

			}

		}.bind(this));

	}.bind(this);

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

	this.storeUpload = function(key,path,type,filename,callback) {

		var err = "";

		Upload.find({ secret: key },function (err, uploadset) {

			var upload = uploadset[0];

			Upload.findById(upload._id, function (err, upload) {
				if (err) return new Error("Couldn't find it.");

				if (constants.ALLOWED_TYPES.indexOf(type) > -1) {
					console.log("!trace good, we accept that type.");

					fs.rename(path, upload.filepath,function(){

						// Now we can complete this guy.
						upload.complete = true;
						upload.save();

						// Callback, no error.
						callback(false);

					});

				} else {
					callback("File type " + type + " is not an allowed type to upload");

				}
			});

		});


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

			if (counted > 0) {
				callback(true);
			} else {
				callback(false);
			}

		});

	}

	

}