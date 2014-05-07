module.exports = function(bot, chat, mongoose, db, constants, privates) {

	// Our static phases.
	var PHASE_INTIALIZED = 1;
	var PHASE_RUNNING = 2;
	var PHASE_UPLOAD = 3;

	// Our static properties
	var MAX_SMCERS = 10;

	// A moment instance.
	var moment = require('moment');

	// And a schedule instance.
	var schedule = require('node-schedule');

	// And our scheduled job (just one at a time)
	// We set it null, but, we'll use it later.
	this.job = null;


	// Setup a schema.
	var smcSchema = mongoose.Schema({
		phase: Number,					// What phase is the SMC in? Initialized, running, uploading, etc.
		topic: String,					// What's the topic?
		originator: String,				// Who started it?
		startsat: Date,					// When does it start?
		duration: Number,				// Who long does it run?
		smcers: [{						// Who's in?
			nick: String,				// ... their name.
			uploaded: Boolean,			// ... did they upload?
			url: String,				// ... what URL did they upload to?
		}],

	}, { collection: 'smcs' });

	// A comma delimited list of smcers.
	smcSchema.virtual('nicklist')
		.get(function () {
			var nicklist = "";
			for (var i = 0; i < this.smcers.length; i++) {
				nicklist += this.smcers[i].nick + ",";
			}
			nicklist.replace(/,$/,"");
			return nicklist;
		});

	// Compile it to a model.
	var SMC = mongoose.model('SMC', smcSchema);

	// Now we want an instance of it.
	var smc = new SMC;

	console.log("!trace the smc document instance: ",smc);

	this.smcScheduler = function() {

		switch (smc.phase) {
			// Our first scheduled item when we're initialized, is to begin the SMC!
			case PHASE_INTIALIZED:
				console.log("!trace the smc doc now: ",smc);
				// Do we have enough participants to start?
				if (smc.smcers.length > 1) {
					// That's good.
					chat.say("smc_starting_now",[smc.nicklist]);
				} else {
					// There's not enough people to start.
					chat.say("smc_not_enough",[smc.originator]);
				}
				break;

			case PHASE_RUNNING:
				break;

			case PHASE_UPLOAD:
				break;
		}

	}

	this.tearDownSMC = function() {

		console.log("Tearing down SMC!!! !trace");
		smc.phase = false;

	}

	// Is this person a particpant?
	this.isParticipant = function(needlenick) {

		for (var i = 0; i < smc.smcers.length; i++) {
			var eachnick = smc.smcers[i].nick
			console.log("!trace each nick: ",eachnick);
			if (eachnick == needlenick) {
				return true;
			}
		}
		return false;
	}


	this.startSMC = function(command,from) {

		console.log("!trace command: ",command);

		// Check for a properly formatted argument format.
		if (command.args.match(/['"].+['"]\s\d\d\s\d\d/)) {

			// Setup our SMC properties.

			console.log("!trace that's good");

			if (!smc.phase) {

				// These are our raw inbound integers for startsat and length.
				var startsat = parseInt(command.arglist[1]);
				var length = parseInt(command.arglist[2]);

				// Now, setup this smc's properties, first the basics.
				smc.phase = PHASE_INTIALIZED;
				smc.originator = from;
				smc.topic = command.arglist[0].replace(/['"]/g,"");
				smc.duration = length;
				smc.smcers.push({nick: from, uploaded: false, url: ""});

				// Now let's get into time. We're going to want to schedule based on these.
				// So let's create a moment.
				var starting_moment = new moment();

				// We'll round to the minute.
				starting_moment.second(0);

				// When the startsat minute is less than now, that means it happens in the next hour.
				if (startsat < starting_moment.minute()) {
					starting_moment.hour(starting_moment.hour()+1);
				}
				starting_moment.minute(startsat);

				// You can get a date back with moment's .toDate() method.
				// So let's chedule it.
				this.job = schedule.scheduleJob(starting_moment.toDate(), this.smcScheduler);

				// Now we can set the smc's startsat property.
				smc.startsat = starting_moment.toDate();

				console.log("!trace the starting_moment: ",starting_moment.format("dddd, MMMM Do YYYY, h:mm:ss a"));

				chat.say("smcstart",[smc.topic,length,sprintf("%0d",startsat)]);
				smc.phase = true;

			} else {

				if (smc.originator == from) {

					chat.say("smc_alreadystarted_by_owner",[from]);

				} else {

					chat.say("smc_already_in_progress",[]);

				}

			}

		} else {

			chat.say("smc_command_error",[]);

		}

	}

	this.cancelSMC = function(from) {

		if (smc.phase) {

			if (smc.originator == from) {

				chat.say("smc_cancel",[from]);
				this.tearDownSMC();

			} else {

				// We should check if they're an admin.
				// If they're not, they're not allowed.
				bot.say("nickserv", "info " + from);

				chat.say("smc_cancel_notallowed",[smc.originator]);

			}

		} else {

			chat.say("smc_no_cancel",[from]);

		}
		
	}

	this.joinSMC = function(from) {

		if (smc.phase) {
			// Are there too many people?
			if (smc.smcers.length < MAX_SMCERS) {

				// Have they already joined?
				if (!this.isParticipant(from)) {
					// Good, they can join.
					chat.say("smc_join",[from]);
					// Add them to the SMCers.
					smc.smcers.push({nick: from, uploaded: false, url: ""});

				} else {
					chat.say("smc_join_alreadyin",[from]);
				}

			} else {
				// Nope, too many people.
				chat.say("smc_join_toomany",[from]);
			}

		} else {
			// Nope, there's no SMC.
			chat.say("smc_join_nosmc",[from]);
		}


	}

}