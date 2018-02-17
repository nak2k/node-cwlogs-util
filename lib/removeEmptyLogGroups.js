const { getCwlogs } = require('./getCwlogs');
const parallel = require('run-parallel');

function removeEmptyLogGroups(options, callback) {
  const {
    logGroupNamePrefix,
  } = options;

  const result = {
    removedLogGroups: [],
  };

  const cwlogs = getCwlogs();

  const deleteLogGroup = logGroup => {
    cwlogs.deleteLogGroup({
      logGroupName: logGroup.logGroupName,
    }, err => {
      if (err) {
        return callback(err);
      }

      result.removedLogGroups.push(logGroup);

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

      if (retentionInDays === undefined) {
        return callback(null);
      }

      const retentionTimestamp = Date.now() - retentionInDays * 24 * 3600 * 1000;

      cwlogs.describeLogStreams({
        logGroupName,
        orderBy: 'LastEventTime',
        descending: true,
        limit: 1,
      }, (err, data) => {
        if (err) {
          return callback(err);
        }

        const { logStreams } = data;

        if (!logStreams) {
          return deleteLogGroup();
        }

        const [ logStream ] = logStreams;

        if (logStreams.LastEventTimestamp > retentionTimestamp) {
          return callback(null);
        }

        return deleteLogGroup();
      });
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
exports.removeEmptyLogGroups = removeEmptyLogGroups;
