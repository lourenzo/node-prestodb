# Presto db Client

A new wrapper around [Presto HTTP API](https://github.com/prestodb/presto/wiki/HTTP-Protocol) wrapper for Node.js.

## Usage

```js
'use strict';

const PrestoClient = require('prestodb');

let prestoClient = new PrestoClient({
  url: 'http://server-url:8080',
  user: 'presto',
  nextUriTimeout: 200 // in miliseconds
});

prestoClient.sendStatement('SELECT * FROM catalog.schema.table')
  .then((result) => {
		console.log(result)
	})
  .catch((error) => {
		console.error({ error })
	});

```


## Todo

- [ ] Offer a EventEmitter version
- [ ] Send progress info
- [ ] More efficient request queueing and throttling 
