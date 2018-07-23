# cwlogs-util

Utility for CloudWatch Logs.

## Installation

```
npm i cwlogs-util
```

## conditionalPutRetentionPolicy(options, callback)

Set a retention policy to log groups that have no policy.

- `options.logGroupNamePrefix`
  - A string that a name of target log groups has as a prefix.
- `options.retentionInDays`
  - A number of days to retain log events.
- `callback(err, result)`
  - A function that is called when setting to log groups is completed, or an error occurs.

## removeEmptyLogGroups(options, callback)

Remove log groups that have no log events.

- `options.logGroupNamePrefix`
  - A string that a name of target log groups has as a prefix.
- `callback(err, result)`
  - A function that is called when removing is completed, or an error occurs.

## License

MIT
