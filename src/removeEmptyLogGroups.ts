import { CloudWatchLogs } from "aws-sdk";
import type { DescribeLogGroupsRequest, FilterLogEventsRequest, LogGroup } from "aws-sdk/clients/cloudwatchlogs";

export interface DeleteEmptyLogGroupsOptions {
  /**
   * The prefix of target log groups.
   */
  logGroupNamePrefix?: DescribeLogGroupsRequest["logGroupNamePrefix"];
}

export interface DeleteEmptyLogGroupsResult {
  /**
   * Deleted log groups.
   */
  deletedLogGroups: LogGroup[];
}

export async function deleteEmptyLogGroups(options: DeleteEmptyLogGroupsOptions): Promise<DeleteEmptyLogGroupsResult> {
  const {
    logGroupNamePrefix,
  } = options;

  const deleteLogGroupPromises: Promise<LogGroup | undefined>[] = [];

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
      deleteLogGroupPromises.push((async (logGroup: LogGroup) => {
        if (!logGroup.logGroupName) {
          return undefined;
        }

        if (!await isLogGroupEmpty(logGroup.logGroupName)) {
          return undefined;
        }

        return cwlogs.deleteLogGroup({
          logGroupName: logGroup.logGroupName,
        }).promise().then(_ => logGroup);
      })(logGroup));
    });

    if (!nextToken) {
      break;
    }

    params.nextToken = nextToken;
  }

  return {
    deletedLogGroups: await Promise.all(deleteLogGroupPromises).then(
      logGroups => logGroups.filter(v => v) as LogGroup[]
    )
  };

  async function isLogGroupEmpty(logGroupName: string) {
    const params: FilterLogEventsRequest = {
      logGroupName,
      limit: 1,
    };

    for (; ;) {
      const data = await cwlogs.filterLogEvents(params).promise();

      const { events, nextToken } = data;

      if (events && events.length > 0) {
        return false;
      }

      if (!nextToken) {
        return true;
      }

      params.nextToken = nextToken;
    }
  }
}
