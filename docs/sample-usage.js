'use strict';
/* eslint no-console: "off" */
const presto = require('../lib');

const prestoClient = new presto.Client();

let query = prestoClient.sendStatement('SELECT * FROM hive.vivo.linhas_teste LIMIT 10');

query.on('data', (data, err) => {
  if (err) {
    return console.error({ err });
  }
  console.log({ data });
});
