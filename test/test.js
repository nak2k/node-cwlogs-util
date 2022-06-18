const test = require('tape');
const {
  conditionalPutRetentionPolicy,
  deleteEmptyLogGroups,
} = require('..');
const AWS = require('aws-sdk');

test('test conditionalPutRetentionPolicy', async t => {
  t.plan(1);

  const result = await conditionalPutRetentionPolicy({
    logGroupNamePrefix: "cwlogs-util",
    retentionInDays: 90,
  });

  t.ok(Array.isArray(result.logGroups));
});

test('test deleteEmptyLogGroups', async t => {
  t.plan(1);

  const result = await deleteEmptyLogGroups({
    logGroupNamePrefix: "cwlogs-util",
  });

  t.ok(Array.isArray(result.deletedLogGroups));
});
