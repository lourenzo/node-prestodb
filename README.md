# node-prestodb

node-prestodb (prestodb)

New Node.js wrapper for Presto HTTP API.

## Usage

```js
'use strict';

const PrestoClient = require('./lib');

let prestoClient = new PrestoClient({
  url: 'http://server-url:8080',
  user: 'presto'
});

prestoClient.sendStatement('SELECT * FROM catalog.schema.table')
  .then((result) => {
		console.log(result)
	})
  .catch((error) => {
		console.error({ error })
	});

```
