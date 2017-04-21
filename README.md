# Presto db Client

A new Presto HTTP API wrapper for Node.js.

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
