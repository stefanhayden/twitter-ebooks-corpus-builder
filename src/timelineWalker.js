
module.exports = function timelineWalker(client, params, allTweets) {
	var allTweets = allTweets || [];

	return new Promise(function(resolve, reject) {
		console.log('Requesting '+ params.count +' tweets to add to the ' + allTweets.length + ' we have so far')

		client.get('statuses/user_timeline', params, function(error, tweets, response){
			if (error) {
				throw error.message;
			}

			if (tweets.length === 0) {
				return resolve(allTweets);
			} else {
				params.max_id = tweets[tweets.length-1].id;
				return timelineWalker(client, params, allTweets.concat(tweets)).then(function(tweetsSoFar) {
					resolve(tweetsSoFar)
				})
			}
		});
	});
}
