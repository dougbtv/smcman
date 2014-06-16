module.exports = function(smcman, bot, chat, mongoose, db, constants, privates) {

	// We remove old files after so long.
	var schedule = require('node-schedule');
	var moment = require('moment');
	// We move files into place when uploaded.
	var fs = require("fs");
	// We use the move module, because it can do things cross device
	// ...just a pointer rename on the same partition is kind of annoying (with purely fs)
	var mv = require('mv');

	// Setup a schema.
	var uploadSchema = mongoose.Schema({

		nick: String,			// Who's uploading?
		secret: String,			// The secret key
		file: String,			// File pointer.
		mime_type: String,		// The mime type.
		indate: Date,			// Date of upload
		is_smc: Boolean,		// Is this for an SMC?
		description: String,	// A description.
		label: String,			// A label, like a gmail email label, same idea.
		complete: Boolean, 		// Is the upload complete?
		tiny_url: Number,		// What's it's tiny url ID?
		deleted: Boolean,		// Is this removed?
		legacy: {				// Exists for legacy items, only.
			recnum: Number,		// Record number from mysql.
			secret: String,		// Old secret.
			file: String,		// The file path (probably most important.)
			category: String,	// Category from filemanage, likely obsolete.
		},
	}, { collection: 'uploads' });

	// We want virtuals when we export to json.
	uploadSchema.set('toObject', { virtuals: true });

	// Elegant little way to hide properties when transforming to object.
	// http://mongoosejs.com/docs/api.html#document_Document-toObject
	// (do a find for "hide", both on that doc, and here. To see it in action)
	uploadSchema.options.toObject.transform = function (doc, ret, options) {
	  if (options.hide) {
	    options.hide.split(' ').forEach(function (prop) {
	      delete ret[prop];
	    });
	  }
	}

	// The URL to upload to.
	uploadSchema.virtual('upload_url')
		.get(function () {
			return privates.URL_SMCSITE + "#/upload?key=" + this.secret;
		});

	// The URL to upload to.
	uploadSchema.virtual('timeago')
		.get(function () {
			// !bang
			var sincewhen = new moment(this.indate);
			return sincewhen.fromNow();
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

			if (this.legacy.recnum) {
				return "http://speedmodeling.org/smcfiles/" + this.legacy.file;
			}

			return privates.URL_SMCSITE + constants.PATH_URL_FILESTORAGE + "/" + this.symlinkname;
		});

	uploadSchema.virtual('is_image')
		.get(function(){

			if (this.legacy.recnum) {
				// Ok, determine if it's an image based on the extension.
				var ext = this.legacy.file.replace(/^.+\.(.+)$/,'$1');
				// console.log("!trace FILENAME / EXTENSION: %s / %s",this.legacy.file,ext);
				// Now see if it matches by it's extension.
				var re_image = new RegExp('(jpg|jpeg|png|tiff|gif|bmp)','i');
				if (ext.match(re_image)) {
					return true;
				} else {
					return false;
				}
			}

			if (typeof this.mime_type == 'undefined') {
				return false;
			}

			if (this.mime_type.match(/(image|jpg|jpeg|png|tga|bmp|svg|gif)/)) {
					return true;
			} else {
					return false;
			}

		});

		// 

	uploadSchema.virtual('symlinkname')
		.get(function () {
			if (this.legacy.recnum) {
				return false;
			}
			return this.secret.substring(0,3) + this.tiny_url.toString(16);
		});

	uploadSchema.virtual('file_directory')
		.get(function () {
			if (typeof this.secret === 'undefined') { return false; }
			return constants.PATH_UPLOAD_STORAGE + this.secret.substring(0,2) + "/";
		});


	uploadSchema.virtual('file_full_path')
		.get(function () {
			return this.file_directory + this.secret;
		});

	// Compile it to a model.
	var Upload = mongoose.model('Upload', uploadSchema);

	// We also keep an incrementing ID for tiny URLs
	// so we have a small schema for that.
	var counterSchema = mongoose.Schema({
		seq: Number,			
	}, { collection: 'counters' });
	var Counter = mongoose.model('Counter', counterSchema);

	this.newUpload = function(from,is_smc,from_webapp,callback) {

		// REMOVED.
		// Might be nice in the future, but, it's spammy during an SMC.
		// check if they're registered.
		// smcman.isRegistered(from,function(status){}.bind(this));
		// // Let them know they have to register, in that case.
		// // chat.say("upload_not_registered",[from]);


		// Good we can upload.
		// By default, it's not from an SMC.
		if (typeof is_smc == 'undefined') { is_smc = false;	}

		// Is this a call from the webapp?
		if (typeof from_webapp == 'undefined') { from_webapp = false;	}

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
		// Only when it's not from the web app..
		if (!from_webapp) {
			chat.whisper(from,"upload_url",[from,upload.upload_url]);
		}

		// Now we can save that.
		upload.save();

		var starting_moment = new moment();
		starting_moment.add('minutes',constants.UPLOAD_TIME_LIMIT);
		
		// Now create a job to check this in 20 minutes.
		schedule.scheduleJob(starting_moment.toDate(), function(){

			this.expireUpload(key);

		}.bind(this));

		// Ok, if it's from the webapp, we return a local url for uploading.
		if (from_webapp) {
			callback(key);
		}


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
				callback(null,upload.file_full_path,upload.mime_type);

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

					// Check out if the path exists.
					// file_directory
					fs.exists(upload.file_directory, function(exists) {

						// If it doesn't exist, make the directory.
						// It's a hack to do this synchronously. But, for now.
						// todo.
						if (!exists) {
							fs.mkdirSync(upload.file_directory);
							console.log("INFO: Created directory: ",upload.file_directory);
						}

						// Move the file into place.
						console.log("!trace moving orig: ",path);				
						console.log("!trace moving dest: ",upload.file_full_path);				
						mv(path, upload.file_full_path,function(err){

							if (err) {
								console.log("ERROR: Move file error: ",err);
							}

							// Get a new tinyURL for it.
							this.newTinyURL(function(tiny_id){

								// Set that right away.
								upload.tiny_url = tiny_id;			// Give it a "tiny url" increment.									

								// We want apache to handle delivering this file.
								// So we make a symlink to it, in an apache accessible dir.
								// Make a symlink to it in the webdir.
								fs.symlink(upload.file_full_path, privates.PATH_UPLOAD_WEBDIR + upload.symlinkname, function(){

									// Now we can complete this guy.
									upload.complete = true;				// Say it's complete
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

								}.bind(this));

							}.bind(this));

						}.bind(this));

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

	// How about listing files for a user?
	// !bang
	this.listFiles = function(nick,label,limit,page,callback) {

		// Setup our search.
		var search = {};
		if (label) {
			search = {nick: nick, label: label};
		} else {
			search = {nick: nick};
		}

		Upload.count(search,function(err,counted){

			Upload.find(search).sort({indate: -1}).skip(limit * (page-1)).limit(limit).exec(function(err,uploads){

				var total_result = [];

				for (var i = 0; i < uploads.length; i++) {
					total_result.push(
						uploads[i].toObject({hide: 'file_full_path file_directory secret upload_url', transform: true ,virtuals: true})
					);
				}

				// console.log("!trace total_result: %j",total_result);

				callback({
					total: counted,
					uploads: total_result,
				});

			});

		});

	}

	

}