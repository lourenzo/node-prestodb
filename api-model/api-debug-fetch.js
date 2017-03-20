'use strict';

const debug = require('debug')('node-prestodb:index.js');
const fetch = require('node-fetch');

// @TODO: move to configs
const prestoURL = 'http://localhost:8080';
const prestoHeaders = { 'X-Presto-User': 'presto' };

function loopNextUri(uri) {
  debug(`loopNextUri('${uri}')`);
  return new Promise((resolve, reject) => {
    fetch(uri, { headers: prestoHeaders })
      .then((res) => res.json())
      .then((body) => {
        debug(`JSON body props: ${Object.keys(body)}`);

        // has columns

        // has data
        if (body.data) {
          debug('emit data');
          //, body.data.toString());
        }


        // has nextUri
        if (body.nextUri) {
          setTimeout(() => {
            loopNextUri(body.nextUri);
          }, 200);
        } else {
          resolve(body);
        }

      })
      .catch(reject);
  });
}

function sendStatement(query) {
  return new Promise((resolve, reject) => {
    fetch(`${prestoURL}/v1/statement`, {
      method: 'POST',
      body: query,
      headers: prestoHeaders
    }).then((res) => res.json())
      .then((body) => {
        debug('JSON body props: ', Object.keys(body));
        debug(`emit stats {${Object.keys(body.stats)}}`);
        resolve(loopNextUri(body.nextUri));
      })
      .catch(reject);
  });
}

let query = 'SELECT * FROM hive.vivo.linhas_teste LIMIT 10';
sendStatement(query).then(() => {
  debug('Good');
  debug(arguments);
}).catch((e) => {
  console.error('Bad');
  console.error(e);
});
