	// Scrape BA to fill up SMC documents in mongodb.
	// ...wish I coded it into smcman previously, lol.
	
	var request = require('request');
	var cheerio = require('cheerio');

	// http://blenderartists.org/forum/forumdisplay.php?22-Speed-Modeling-Contests/page73
	var BASE_URL = "http://blenderartists.org/forum/forumdisplay.php?22-Speed-Modeling-Contests/page";
	var MAX_URL = 73;

	var options = {
			method: 'GET',
    		uri: BASE_URL + MAX_URL,
		};

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

				// $('#fruits').find('li')
				var rawtitle = $(this).find('.threadtitle').find('.title');

				if (rawtitle.length) {
					console.log("\n\n\n\n!trace =================================================\n\n",rawtitle['0']);
					console.log("\n\n\n\n!trace -------------------------------------------------n\n",rawtitle['0'].attribs);
				}


			});

		}
	});
