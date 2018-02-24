
const { getCwlogs } = require('./getCwlogs');
const parallel = require('run-parallel');


function conditionalPutRetentionPolicy(options, callback) {
  const {
    logGroupNamePrefix,
    retentionInDays,
    undefinedRetention = true,
  } = options;

  const result = {
    logGroups: [],
  };

  const cwlogs = getCwlogs();

  const putRetentionPolicy = (logGroup, callback) => {
    cwlogs.putRetentionPolicy({
      logGroupName: logGroup.logGroupName,
      retentionInDays,
    }, err => {
      if (err) {
        return callback(err);
      }

      result.logGroups.push(logGroup);

      callback(null);
    });
  }

  cwlogs.describeLogGroups({
    logGroupNamePrefix,
  }).eachPage((err, data, done) => {
    if (err) {
      return callback(err);
    }

    if (!data) {
      return callback(null, result);
    }

    const tasks = data.logGroups.map(logGroup => callback => {
      const {
        logGroupName,
        retentionInDays
      } = logGroup;

      if (retentionInDays === undefined && undefinedRetention) {
        return putRetentionPolicy(logGroup, callback);
      }

      callback(null);
    });

    parallel(tasks, (err, result) => {
      if (err) {
        return callback(err);
      }

      done();
    });
  });
}

/*
 * Exports.
 */
exports.conditionalPutRetentionPolicy = conditionalPutRetentionPolicy;
