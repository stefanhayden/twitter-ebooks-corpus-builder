var path = require('path');
var getAccountTweets = require('./getAccountTweets.js');

module.exports = function getNewTweets(account, files, options) {
	// if auth keys passed try and get new tweets from account
	const consumer_key = options.consumer_key;
	const consumer_secret = options.consumer_secret;
	const access_token_key = options.access_token_key;
	const access_token_secret = options.access_token_secret;

	var  backupDone = Promise.resolve();
	if (consumer_key && consumer_secret && access_token_key && access_token_secret) {
		const tweetOptions = {};

		files.map(file => {
			var ext = path.extname(file);
			var filename = path.basename(file, ext);

			if (filename === account && ext === '.json') {
				//get the most recent tweet datetime
				tweetOptions.file = file;
			}
		});

		backupDone = getAccountTweets(account, { consumer_key, consumer_secret, access_token_key, access_token_secret }, tweetOptions);
	}

	return backupDone;
}
