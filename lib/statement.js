'use strict';

const fetch = require('node-fetch');
const debug = require('debug')('node-prestodb:Statement');

/**
 * Send Statements to Presto Server
 *
 * @param {Object} config
 * @param {String} query
 */
function send(config, query) {

  return new Promise((resolve, reject) => {

    let headers = { 'X-Presto-User': config.user };
    let results = {};

    fetch(`${config.url}/v1/statement`, {
      method: 'POST',
      body: query,
      headers
    })
      .then( (response) => response.json() )
      .then( (statement) => {

        // Check if there is a 'error' property
        // |> reject with the error information
        // |else> |> check for columns or data
        // |> loop 'nextUri's
        //        |> check for columns or data
        // try to resolve: with data or error

        debug(`state:${statement.stats.state}`);

        if (statement.error) {
          debug({'statement.error': statement.error});
          return reject(statement.error);
        }
        results = collectResults(results, statement);
        // do we need to collect results and check errors here?

        if (statement.nextUri) {
          debug('>| fetchAllNextUris');

          fetchAllNextUris(results, config, statement.nextUri)
            .then((results) => {
              debug('<| end fetchAllNextUris');
              debug('result stats', {
                'Data Length': results.data.length
              });
              resolve(results);
            }).catch(reject);

        } else {
          resolve(results);
        }



      })
      .catch((error) => {
        debug({ error });
        reject(error);
      });



  });
}
module.exports = { send };


/**
 * Collect results and return them
 *
 * @param {Object} results
 * @param {Object} statement
 */
function collectResults(results, statement) {

  let newResults = Object.assign({
    data: []
  }, results);

  if (statement.error) {
    debug('statement.error', statement.error);
    let error = new Error(`[${statement.error.errorName}]${statement.error.message}`);
    error.serverError = statement.error;
    throw error;
  }

  // if statement.data
  if (statement.data) {
    newResults.data = newResults.data.concat(statement.data);
    debug('statement has data');
  }
  // if statement.columns
  if (statement.columns) {
    debug('statement has columns');
    newResults.columns = statement.columns;
  }
  return newResults;
}


/**
 * Fetch a single nextUri for a statement
 *
 * @param {Object} config
 * @param {String} uri
 */
function fetchNextUri(config, uri) {
  debug('fetchNextUri', {uri});
  return fetch(uri, {
    headers: { 'X-Presto-User': config.user }
  }).then((response) => response.json());
}


/**
 * Fetch all nextUri
 * @param {Object} currentResults
 * @param {Object} config
 * @param {String} uri
 * @todo: add configurable timeout
 * @todo: add progress-handling code [start with debugging]
 */
function fetchAllNextUris(currentResults, config, uri) {

  return new Promise((resolve, reject) => {
    fetchNextUri(config, uri)
      .then((statement) => {
        let results = collectResults(currentResults, statement);
        if (statement.nextUri) {
          setTimeout(() => {
            resolve(fetchAllNextUris(results, config, statement.nextUri))
          }, config.nextUriTimeout);
        } else {
          resolve(results);
        }
      }).catch(reject);
  });

}
