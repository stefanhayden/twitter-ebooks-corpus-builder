var fs = require('fs');
var path = require('path');
var reduce = require('stream-reduce');
var parse = require('csv-parse');
var transform = require('stream-transform');
var JSONStream = require('JSONStream');

util = {};

util.file2File = function(file1, file2) {
	var rs = fs.createReadStream(file1);
	rs.setEncoding('utf8');

	var ws = fs.createWriteStream(file2, { flags: 'w'});

	var p = new Promise((resolve, reject) => {
		ws.on('finish', () => {
			resolve();
		});
		ws.on('error', (e) => {
			reject(e);
		});
	});

	rs
		.pipe(JSONStream.parse())
		.pipe(transform(function(data, cb){
			cb(null, JSON.stringify(data, null, 4));
		}))
		.pipe(ws);

	rs.on('end', () => {
		ws.end();
	});

	return p;
}

util.handleCsvFile = function(file, outputFile) {
	var parser = parse();
	var rs = fs.createReadStream(file);
	rs.setEncoding('utf8');
	
	var ws = fs.createWriteStream(outputFile, { flags: 'a'});
	ws.on('error', function (err) {
		throw err;
	});

	var transformer = transform(function(data, cb){
		cb(null, data[5]+'\n');
	}, {parallel: 10});

	rs
		.pipe(parser)
		.pipe(transformer)
		.pipe(ws);
};

util.handleJsonFile = function(file, outputFile) {

	var rs = fs.createReadStream(file);
	rs.setEncoding('utf8');
	
	var ws = fs.createWriteStream(outputFile, { flags: 'a'});
	ws.on('error', function (err) {
		throw err;
	});

	var transformer = transform(function(data, cb){
		cb(null, data.replace(/\n/g, ' ')+'\n');
	}, {parallel: 10});

	rs
		.pipe(JSONStream.parse('*.text'))
		.pipe(transformer)
		.pipe(ws);
};

util.handleTextFile = function(file, outputFile) {

	var rs = fs.createReadStream(file);
	rs.setEncoding('utf8');
	
	var ws = fs.createWriteStream(outputFile, { flags: 'a'});
	ws.on('error', function (err) {
		throw err;
	});

	rs
		.pipe(ws);
};

util.getFirstTweetFromJsonFile = function(file) {
	var rs = fs.createReadStream(file);
	rs.setEncoding('utf8');
	var hasNotBeeenCalled = true;

	return new Promise(function(resolve, reject) {
		rs
			.pipe(JSONStream.parse('*.id_str'))
			.pipe(reduce((aac, id) => {
				if (hasNotBeeenCalled) {
					resolve(id);
					hasNotBeeenCalled = false;
				}
				rs.destroy();
				return id
			}, ''));
	});

}

util.inputsToFileArray = function(input) {
	var files = input.map(function(val){
		var out;
		if(path.parse(val).ext) {
			if(!path.isAbsolute(val)) {
				throw 'Please provide an absolute path to: ' + val;
			}
			out = val;
		} else {
			// val could be a directory so lets get all the files from that dir
			out = fs.readdirSync(val).map(function(f) {
				f = path.join(val, f);
				if(!path.isAbsolute(f)) {
					throw 'Please provide an absolute path to: ' + f;
				}
				return f;
			});
		}

		return out;
	});
	// this will flatten array
	var files = [].concat.apply([], files);

	return files;
}

module.exports = util;
