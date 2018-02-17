const test = require('tape');
const {
  removeEmptyLogGroups,
} = require('..');
const AWS = require('aws-sdk');

AWS.config.update({ region: process.env.AWS_REGION || 'us-west-2' });

test('test removeEmptyLogGroups', t => {
  t.plan(2);

  removeEmptyLogGroups({}, (err, result) => {
    t.error(err);

    t.ok(Array.isArray(result.removedLogGroups));
  });
});
