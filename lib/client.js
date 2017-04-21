'use strict';

const debug = require('debug')('node-prestodb:Client');
const Statement = require('./statement');

/**
 * Presto Client
 *  - Saves server config URL and proxies statement calls
 */
class Client {

  /**
   * @param {object} config must contain 'url' and 'user'
   */
  constructor(config) { //serverURL, catalog = 'hive'
    debug('new Client', { config });
    this.config = config;

    if (!this.config.nextUriTimeout || typeof this.config.nextUriTimeout !== 'number') {
      this.config.nextUriTimeout = 0;
    }

  }

  /**
   * Send a statement using instance's config
   * @param {String} query A valid presto SQL statement
   */
  sendStatement (query) {
    debug('Client.sendStatement', query);
    return Statement.send(this.config, query);
  }
}

module.exports = Client;
