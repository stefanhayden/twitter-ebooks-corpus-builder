var path = require('path');
var fs = require('fs');
var util = require('./utils.js')
var getNewTweets = require('./getNewTweets.js')

module.exports = function(account, input, output, options) {
	var outputFile;

	if(!account) {
		throw 'please provided an account name so we can auto archive account'
	}

	//let options be passed in 3rd if they just want default output file
	if (typeof output === 'object') {
		options = output;
		output = undefined;
	}

	if(!output) {
		output = './';
	}

	if(path.parse(output).ext) {
		outputFile = output;
	} else {
		outputFile = path.join(output, account + '_output.txt')
	}

	if (typeof input === 'string') {	
		input = [input];
	} else if(!input.isArray) {
		throw 'Input location must be a path or array of paths';
	}

	var files = util.inputsToFileArray(input);

	getNewTweets(account, files, options).then(() => {
		writeToOutput(files, outputFile)
	});

}

function writeToOutput(files, outputFile) {
		// clear the output file.
		fs.writeFileSync(outputFile, '', { flags: 'w' });

		// fill the output file with data
		files.map(file => {
			var type = path.extname(file);

			if (type == '.csv') {
				console.log('copy csv tweets to corpus')
				util.handleCsvFile(file, outputFile);
			}

			if (type == '.json') {
				console.log('copy json tweets to corpus')
				util.handleJsonFile(file, outputFile)
			}

			if (type == '.txt') {
				console.log('copy text tweets to corpus')
				util.handleTextFile(file, outputFile)
			}
		});
}
