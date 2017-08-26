'use strict';

const expect = require('chai').expect; // @see: http://chaijs.com/guide/styles/#expect

describe('Create a Client instance', () => {

  let Client;
  let Statement;

  it('Requires lib', () => {
    Client = require('../lib/Client');
    Statement = require('../lib/Statement');
    expect(Client).to.be.a('function');
  });

  let clientInstance;

  it('Creates a valid Client Object', () => {
    clientInstance = new Client({
      url: 'http://localhost:8080',
      user: 'presto',
      catalog: 'catalog',
      schema: 'schema',
      nextUriTimeout: 200
    });
    expect(clientInstance).to.be.a('object');

    expect(clientInstance).to.be.an.instanceOf(Client);

    expect(clientInstance).to.haveOwnProperty('config');

    expect(clientInstance).to.have.property('sendStatement')
      .which.is.a('function');
  });

  it('Returns successful promise for sendStatement', function () {
    const stmt = clientInstance.sendStatement('SELECT \'a\' as a');
    expect(stmt).to.be.a('promise');
    return stmt
      .then(result => {
        expect(result).to.be.a('object');
        expect(result.data).to.have.lengthOf(1);
        expect(result.data[0][0]).to.equal('a');
        expect(result.columns).to.have.lengthOf(1);
        expect(result.columns[0].name).to.equal('a');
      });
  });

});
