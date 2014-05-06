// Creates a "constants" object with defines
// To use like, well, defined constants, but... pack it up real nice.
// Idea: http://stackoverflow.com/questions/8595509/how-do-you-share-constants-in-nodejs-modules

function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

// ---------------------------------- IRC Constants
// --- They're in config_private.js
// --- Due to the fact that they're more-or-less personalized.

//---------------------------------- File Path Constants
define("FILE_FLAG",'/var/spool/asterisk/tmp/whistler.flag');				// The file we set to "flag" that a call is in progress (asterisk removes it when done)
define("FILE_FLAG_MAXAGE",300);												// That lockfile/flag has an age at which it becomes stale (in seconds)
define("FILE_TXT",'/var/spool/asterisk/tmp/say.txt');						// Where we write the contents of the text-to-be-spoken
define("FILE_SOUND",'/var/spool/asterisk/tmp/crank.ulaw');					// The target sound file.
define("FILE_SOUND_ASTERISKFORMAT",'/var/spool/asterisk/tmp/crank');		// This is the sound file without the extension.
define("FILE_WRITECALL",'/var/spool/asterisk/tmp/crank.call');				// Where we'll write the call file.
define("FILE_OUTGOINGSPOOL",'/var/spool/asterisk/outgoing/');					// Where we want the call file to end up (in Asterisk's spool)
define("FILE_OWNER",'doug');												// Some files need special permissions to work with asterisk, e.g. to let the dialplan have access to them.
define("FILE_GROUP",'asterisk');
define("FILE_MODE",'775');

// --------------------------------- By default, we say the templates for call files are in the current working directory (change to suit your needs, however, if you run from the CWD of the checkout, this should be appropriate)

cwd = process.cwd();

// --------------------------------- Call-file templates
define("CALLFILE_TEMPLATE_PLAIN",cwd + '/callfiles/vanilla.call'); 							// For the !crank feature.
define("CALLFILE_RESULT_PLAIN",'/var/spool/asterisk/tmp/vanilla.call');						// 	...where the file lands.

define("CALLFILE_TEMPLATE_CONFERENCE",cwd + '/callfiles/originate_for_conference.call');	// For the !monitorcrank feature.
define("CALLFILE_RESULT_CONFERENCE",'/var/spool/asterisk/tmp/conference.call');				// 	...and where we write it when done.

define("CALLFILE_TEMPLATE_SPEAK",cwd + '/callfiles/speak_to_conference.call'); 				// ...and for !monitorcrank feature to play the sound to the conference.
define("CALLFILE_RESULT_SPEAK",'/var/spool/asterisk/tmp/speak.call');

// --------------------------------- Asterisk-specific constants.
define("ASTERISK_CONTEXT",'crankcall');								// The plain crank call context.
define("ASTERISK_CONTENT_CONFERENCE",'crankmonitor');				// The context to get the cranked party into the conference.
define("ASTERISK_CONTEXT_CONFERENCETALKER",'meetmecranktalker');	// The context to get the bot into the conference.

define("ASTERISK_CHANNEL",'Gtalk/asterisk/+1{NUMBER}@voice.google.com'); // The channel to use when dialing.

// -----------
/*
db.auth("whistler","zerobot!")
*/