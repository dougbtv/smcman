
module.exports = function(server,smcman, bot, chat, mongoose, db, constants, privates) {

	// --------------------------------------------------------------------
	// -- myConstructor : Throws the constructor into a method.
	// ...Because javascript wants the methods to be defined before referencing them.

	// So you want to interoperate with Apache?
	// Try a directive like so:
	// ProxyPass /api/ http://localhost:8000/api/
	
	this.myConstructor = function() {

		// Method call at the bottom of this class.
	
		server.get('/api/foo', this.testFunction);
		server.post('/api/foo', this.testFunction);
		server.head('/api/foo', this.testFunction);

		server.get('/api/verifyUploadKey', this.verifyUploadKey);
		server.post('/api/verifyUploadKey', this.verifyUploadKey);
		server.head('/api/verifyUploadKey', this.verifyUploadKey);

		server.get('/api/upload', this.fileUpload);
		server.post('/api/upload', this.fileUpload);
		server.head('/api/upload', this.fileUpload);


	};

	this.serverStart = function() {

		server.listen(constants.SERVER_PORT, function() {
			console.log(server.name + ' listening at ' + server.url);
		});

	}

	this.fileUpload = function(req, res, next) {

		var input = req.params;
		var files = req.files;

		console.log("!trace verify input: ",input);
		console.log("!trace verify files: ",files);

		// First things first, verify the key.
		this.isVerified(input.key,function(verified){
			if (verified) {
				console.log("!trace GREAT, uploaded file, and verified.");
				// Make a request to store it.
				smcman.upload.storeUpload(input.key,files.file.path,files.file.type,files.file.name,function(err,url){

					if (!err) {

						// Ok, good, that's a file we use.
						// Let them know it errored out.
						res.contentType = 'json';
						res.send({success: true, url: url});

					} else {

						// Let them know it errored out.
						res.contentType = 'json';
						res.send({error: err});

					}

				});
				
			} else {

				// Return a JSON result.
				res.contentType = 'json';
				res.send({error: "Key not verified on file upload"});

			}
		});

		



	}.bind(this);

	this.verifyUploadKey = function(req, res, next) {

		var input = req.params;

		console.log("!trace verify key: ",input);

		this.isVerified(input.key,function(verified){
			// Return a JSON result.
			res.contentType = 'json';
			res.send({success: verified});
		});

	}.bind(this);

	this.isVerified = function(key,callback) {

		// Ok, so I'm going to have to talk to the Upload module
		// likely via the bot.
		smcman.upload.isUploadVerified(key,function(verified){

			if (verified) {
				callback(true);
			} else {
				callback(false);
			}

		});

	}.bind(this);

	this.testFunction = function(req, res, next) {

		// console.log(req.params);

		var return_json = [
			{text: "this and that"},
			{text: "the other thing"},
			{text: "final"}
		];
		
		// Return a JSON result.
		res.contentType = 'json';
		res.send(return_json);

	}.bind(this);

	// Call the constructor (after defining all of the above.)

	this.myConstructor();

	
}