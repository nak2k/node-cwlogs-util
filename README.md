# cwlogs-util

Utility for CloudWatch Logs.

## Installation

```
npm i cwlogs-util
```

## conditionalPutRetentionPolicy(options)

Set a retention policy to log groups that have no policy.

- `options.logGroupNamePrefix`
  - The prefix of target log groups.
- `options.retentionInDays`
  - The number of days to retain log events.

Return an object has following properties:

- `logGroups`
  - Log groups that the retention policy is set.

## deleteEmptyLogGroups(options)

Delete log groups that have no log events.

- `options.logGroupNamePrefix`
  - The prefix of target log groups.

Return an object has following properties:

- `deletedLogGroups`
  - Deleted log groups.

## License

MIT
