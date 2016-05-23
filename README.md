Twitter eBooks Corpus Builder
=======

Accepts json, csv, and txt input and after optionally backing up a twitter account will create a single txt corpus best for eBooks twitter bot use.

Quick Start
=======
```javascript
var twitterCorpus = require('twitter-ebooks-corpus-builder');
var path = require('path');


twitterCorpus(
  [
    path.join(__dirname, './input/twitterAccountName.csv'),
    path.join(__dirname, './input/twitterAccountName.json'),
    path.join(__dirname, './input/anyFile.txt'),
  ],
	path.join(__dirname, './output.txt'),
  {
    account: 'twitterAccountName',
    consumer_key: '******',
    consumer_secret: '******',
    access_token_key: '******',
    access_token_secret: '******'
  }
);
```

Installation
====
```
npm install twitter-ebooks-corpus-builder
```


API
====
```javascript
var twitterCorpus = require('twitter-ebooks-corpus-builder');

twitterCorpus(inputs[, output][, options])
```
* **inputs** - required
  absolute path to file, absolute path to directory, or array of absolute paths or directories.
* **output** - optional
  final corpus output. Defaults to `output.txt` in the directory of your script
* **options** - optional
  if output is null options may be passed in 3rd
  this is for the twitter api authentication. all 5 are required if you wish to backup the twitter account:
  `account`, `consumer_key`, `consumer_secret`, `access_token_key`, `access_token_secret`
