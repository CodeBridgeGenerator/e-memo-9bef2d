const assert = require('assert');
const app = require('../../src/app');

describe('\'memorandum\' service', () => {
  it('registered the service', () => {
    const service = app.service('memorandum');

    assert.ok(service, 'Registered the service (memorandum)');
  });
});
