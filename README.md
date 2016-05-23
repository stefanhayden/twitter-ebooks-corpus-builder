Twitter eBooks Corpus Builder
=======

Accepts json, csv, and txt input and after backing up a twitter account will create a single txt corpus best for eBook    s twitter bot use.

Quick Start
=======
```javascript
var twitterCorpus = require('twitter-ebooks-corpus-builder');
var path = require('path');


twitterCorpus(
  'twitterAccountName',
  [
    path.join(__dirname, './input/twitterAccountName.csv'),
    path.join(__dirname, './input/twitterAccountName.json'),
    path.join(__dirname, './input/anyFile.txt'),
  ],
  {
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

twitterCorpus(account, inputs[, output][, options])
```
* **account** - required
  the account name of the twitter acount that will be auto archived
* **inputs** - required
  absolute path to file, absolute path to directory, or array of absolute paths or directories.
* **output** - optional
  final corpus output. Defaults to `accountName_output.txt`
* **options** - optional
  if output is null options may be passed in 3rd
  this is for the twitter api authentication. all 4 are required if you wish to backup the twitter account:
  `consumer_key`, `consumer_secret`, `access_token_key`, `access_token_secret`
