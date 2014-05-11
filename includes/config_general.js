// Creates a "constants" object with defines
// To use like, well, defined constants, but... pack it up real nice.
// Idea: http://stackoverflow.com/questions/8595509/how-do-you-share-constants-in-nodejs-modules

function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

define("SERVER_PORT",8001);

define("ALLOWED_TYPES",[
	'image/gif',
	'image/jpeg',
	'image/pjpeg',
	'image/png',
	'image/svg+xml',
	'image/vnd.djvu',
	'image/example',
]);

define("PATH_UPLOAD_STORAGE","/tmp/");

define("UPLOAD_TIME_LIMIT",20); // In minutes.

// -----------
/*
db.auth("whistler","zerobot!")

'image/gif',
'image/jpeg',
'image/pjpeg',
'image/png',
'image/svg+xml',
'image/vnd.djvu',
'image/example',

*/
