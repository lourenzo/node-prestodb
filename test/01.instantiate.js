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
    clientInstance = new Client('http://localhost:8080');
    expect(clientInstance).to.be.a('object');

    expect(clientInstance).to.be.an.instanceOf(Client);

    expect(clientInstance).to.haveOwnProperty('serverURL');
    expect(clientInstance).to.haveOwnProperty('catalog');

    expect(clientInstance).to.have.property('runStatement')
      .which.is.a('function');
  });

  it('Returns a valid Statement on runStatement', () => {
    let stmt = clientInstance.runStatement('SELECT \'a\' as a');
    expect(stmt).to.be.a('object');

    expect(stmt).to.be.an.instanceOf(Statement);

    expect(stmt).to.have.property('on')
      .which.is.a('function');
    expect(stmt).to.have.property('emit');


  });

});
