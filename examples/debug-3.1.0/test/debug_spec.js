/* global describe, it, context, beforeEach */
'use strict';

var chai
  , expect
  , debug
  , sinon
  , sinonChai;

if (typeof module !== 'undefined') {
  chai = require('chai');
  expect = chai.expect;

  debug = require('../src/index');
  sinon = require('sinon');
  sinonChai = require("sinon-chai");
  chai.use(sinonChai);
}


describe('debug', function () {
  var log = debug('test');

  log.log = sinon.stub();

  it('-0-passes a basic sanity check', function () {
    expect(log('hello world')).to.not.throw;
  });

  it('-1-allows namespaces to be a non-string value', function () {
    expect(debug.enable(true)).to.not.throw;
  });

  context('with log function', function () {

    beforeEach(function () {
      debug.enable('test');
      log = debug('test');
    });

    it('-2-uses it', function () {
      log.log = sinon.stub();
      log('using custom log function');

      expect(log.log).to.have.been.calledOnce;
    });
  });

  describe('custom functions', function () {
    var log;

    beforeEach(function () {
      debug.enable('test');
      log = debug('test');
    });

    context('with log function', function () {
      it('-3-uses it', function () {
        log.log = sinon.spy();
        log('using custom log function');

        expect(log.log).to.have.been.calledOnce;
      });
    });
  });

});
