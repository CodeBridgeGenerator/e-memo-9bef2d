const assert = require('assert');
const app = require('../../src/app');

describe('\'department\' service', () => {
  it('registered the service', () => {
    const service = app.service('department');

    assert.ok(service, 'Registered the service (department)');
  });
});
