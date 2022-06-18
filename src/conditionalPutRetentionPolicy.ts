import { CloudWatchLogs } from "aws-sdk";
import type { DescribeLogGroupsRequest, LogGroup, PutRetentionPolicyRequest } from "aws-sdk/clients/cloudwatchlogs";

export interface ConditionalPutRetentionPolicyOptions {
  /**
   * The prefix of target log groups.
   */
  logGroupNamePrefix?: DescribeLogGroupsRequest["logGroupNamePrefix"];

  /**
   * The number of days to retain log events.
   */
  retentionInDays: PutRetentionPolicyRequest["retentionInDays"];
}

export interface ConditionalPutRetentionPolicyResult {
  /**
   * Log groups that the retention policy is set.
   */
  logGroups: LogGroup[];
}

/**
 * Set a retention policy to log groups that have no policy.
 *
 * @param options 
 * @returns 
 */
export async function conditionalPutRetentionPolicy(options: ConditionalPutRetentionPolicyOptions): Promise<ConditionalPutRetentionPolicyResult> {
  const {
    logGroupNamePrefix,
    retentionInDays,
  } = options;

  const putRetentionPolicyPromises: Promise<LogGroup>[] = [];

  const cwlogs = new CloudWatchLogs();

  const params: DescribeLogGroupsRequest = {
    logGroupNamePrefix,
  }

  for (; ;) {
    const data = await cwlogs.describeLogGroups(params).promise();

    const { logGroups, nextToken } = data;

    if (!logGroups) {
      break;
    }

    logGroups.forEach(logGroup => {
      if (!logGroup.logGroupName || logGroup.retentionInDays) {
        return;
      }

      putRetentionPolicyPromises.push(cwlogs.putRetentionPolicy({
        logGroupName: logGroup.logGroupName,
        retentionInDays,
      }).promise().then(_ => logGroup));
    });

    if (!nextToken) {
      break;
    }

    params.nextToken = nextToken;
  }

  return {
    logGroups: await Promise.all(putRetentionPolicyPromises),
  };
}
