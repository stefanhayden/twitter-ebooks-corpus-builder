var timelineWalker = require('./timelineWalker.js');
var writeCombinedJsonFile = require('json-stream-combiner')
var Twitter = require('twitter');
var util = require('./utils.js')
var fs = require('fs');

module.exports = function getAccountTweets(account, keys, options) {
	var client = new Twitter({
		consumer_key: keys.consumer_key,
		consumer_secret: keys.consumer_secret,
		access_token_key: keys.access_token_key,
		access_token_secret: keys.access_token_secret,
	});

	var params = {
		screen_name: account,
		count: 200,
	};

	if (options.file) {
		return util.getFirstTweetFromJsonFile(options.file).then(function(id) {
			console.log('Gettting new tweets since tweets Id: ', id);
			params.since_id = id;

			return timelineWalker(client, params)
		}).then(function(data) {
				if (data.length > 0) {
					console.log('starting to update files')
					return writeCombinedJsonFile([data, options.file], options.file + '.tmp')
					.then(() => {
						console.log('done writing tmp file')
						return util.file2File(options.file, options.file + '.backup');
					}).then(() => {
						console.log('done writing backup file')
						return util.file2File(options.file + '.tmp', options.file);
					}).then(() => {
						console.log('done copying tmp to main file. deleteing tmp file...')
						return fs.unlink(options.file + '.tmp');
					});
				} else {
					console.log('no new tweets. do nothing?')
					return Promise.resolve();
				}
			});
	} else {
		return timelineWalker(client, params).then(function(data) {
			console.log('do somethig with '+data.length+' tweets')
			return writeCombinedJsonFile([data], account + '.json');
		});
	}
}
