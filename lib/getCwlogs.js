let cwlogs = null;

function getCwlogs() {
  if (!cwlogs) {
    const AWS = require('aws-sdk');

    cwlogs = new AWS.CloudWatchLogs();
  }

  return cwlogs;
}

exports.getCwlogs = getCwlogs;
