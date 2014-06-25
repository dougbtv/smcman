	// Scrape BA to fill up SMC documents in mongodb.
	// ...wish I coded it into smcman previously, lol.
	
	sprintf = require('sprintf-js').sprintf;

	var request = require('request');
	var cheerio = require('cheerio');
	var moment = require('moment');

	var MONTHS = [
		"{zero}",
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];

	// http://blenderartists.org/forum/forumdisplay.php?22-Speed-Modeling-Contests/page73
	var BASE_URL = "http://blenderartists.org/forum/forumdisplay.php?22-Speed-Modeling-Contests/page";
	var FORUM_BASE = "http://blenderartists.org/forum/";
	var MAX_URL = 74;

	getPostList = function(options) {

		// We request the new post page.
		request(options, function(error, response, html){
			if(!error){

				// We use cheerio for dom parsing
				var $ = cheerio.load(html);

				var threads = $('.inner').each(function(idx,threadtag){
					// console.log("\n\n\n\n\n\n\n\n\n!trace threadtag: -----------------------------------------------\n\n",threadtag);

					// So I wanna find: threadtitle
					// which gives me URL and title in an a tag.
					// And: threadmeta
					// which gives me the author... so I know which ones to parse.

					var rawtitle = $(this).find('.threadtitle').find('.title');

					if (rawtitle.length) {
						var posturl = FORUM_BASE + rawtitle['0'].attribs.href;
						var posttitle = rawtitle['0'].children[0].data;

						// Now find that author.
						var rawmeta = $(this).find('.threadmeta').find('.username');
						var rawdate = rawmeta['0'].attribs.title;
						var postauthor = rawmeta['0'].children[0].data;

						// Now we can figure out if this is eligible for processing...
						if (postauthor == "protocoldoug") {

							// Ok, let's parse the date.
							var datestring = rawdate.replace(/^.+on\s(.+)$/,'$1');
							
							// Bust that out.
							var re_badate = /^(\d+)\-(...)\-(\d\d).(..)\:(..)/;
							var date_day = datestring.replace(re_badate,"$1");
							var date_mon = datestring.replace(re_badate,"$2");
							var date_year = datestring.replace(re_badate,"$3");
							var date_hour = datestring.replace(re_badate,"$4");
							var date_minute = datestring.replace(re_badate,"$5");

							var date_mon = sprintf("%0d",MONTHS.indexOf(date_mon));

							// Sample: "2013-02-08 09:30"
							var parsedatestring = "20" + date_year + "-" + date_mon + "-" + date_day + " " + date_hour + ":" + date_minute;

							console.log("!trace datestring: ",datestring);
							console.log("!trace parsedatestring:",parsedatestring);

							var postdate = new moment(parsedatestring);


							// Yep, that's an automated one
							// But check the subject syntax...

							if (posttitle.match(/^\[\s.+?(\s\])\s\-\s\[\s\d+\sMinutes\s\]$/)) {
								console.log("!trace: author: %s | date: %s | title: %s | url: %s",postauthor,postdate,posttitle,posturl);

								// Ok, that's looking really good. 
								// Now, let's pull up an SMC's page
								throw "!trace That's all folks.";

							} else {
								console.log("!NOTICE: Didn't match on title: ",posttitle);
							}

						}


					}

				});

			}
		});

	}
	
	// -------------------------- The Handler! (comes at the end, all JS style.)

	for (var i = MAX_URL; i > 0; i--) {

		var options = {
			method: 'GET',
			uri: BASE_URL + i.toString(),
		};

		console.log("Getting page: " + i.toString());
		getPostList(options);

		// Just for testing...
		break;


	}

