'use strict';

const debug = require('debug')('node-prestodb:api-debug');
const co = require('co');
const fetch = require('node-fetch');

// @TODO: move to configs
const prestoURL = 'http://localhost:8080';

function readUri(uri) {
  return new Promise((resolve, reject) => {
    fetch(uri, { headers: { 'X-Presto-User': 'presto' } })
      .then((res) => res.json())
      .then((json) => { debug('json', json); return json;})
      .catch(reject);
  });
}

function* readNextUri(nextUri, timeout = 1) {
  debug('> readNextUri called');
  debug({arguments});

  let resBody = yield readUri(nextUri);
  debug('resBody', resBody);


}


co(function* () {

  let query = 'SELECT * FROM linhas_teste LIMIT 10';

  debug(`Presto server: ${prestoURL}`);
  debug(`Query: ${query}`);

  debug('Posting to server in /v1/statement');
  let stmtRes = yield fetch(`${prestoURL}/v1/statement`, {
    method: 'POST',
    body: query,
    headers: {
      'X-Presto-User': 'presto'
    }
  });
  debug('Fetching Server Response');
  let stmtResBody = yield stmtRes.json();
  //debug('Response:', {stmtRes, stmtResBody});

  // Process body
  debug('Response Properties:', Object.keys(stmtResBody));
  //console.dir(stmtResBody);

  while (true) {
    let statusBody = yield readNextUri(stmtResBody.nextUri);
    debug({statusBody});
    break;
  }



  //let nextUri


  /*let fields = {
    status: stmtResponse.status
  }*/



})
.then(function () {
  //debug('Done. Called co\'s then', {arguments});
  process.exit(0);
})
.catch((error) => debug(`[Error]: ${error.message}`));
