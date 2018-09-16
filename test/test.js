const test = require('tape');
const {
  conditionalPutRetentionPolicy,
  removeEmptyLogGroups,
} = require('..');
const AWS = require('aws-sdk');

test('test conditionalPutRetentionPolicy', t => {
  t.plan(2);

  conditionalPutRetentionPolicy({
    retentionInDays: 7,
  }, (err, result) => {
    t.error(err);

    t.ok(Array.isArray(result.logGroups));
  });
});

test('test removeEmptyLogGroups', t => {
  t.plan(2);
  removeEmptyLogGroups({}, (err, result) => {
    t.error(err);

    t.ok(Array.isArray(result.removedLogGroups));
  });
});
