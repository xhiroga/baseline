import {
  CloudWatchLogsClient,
  DescribeLogGroupsCommandOutput,
  LogGroup,
  paginateDescribeLogGroups,
} from '@aws-sdk/client-cloudwatch-logs';
import { paginate } from '../util/paginate';

export class LogsApi {
  private readonly client: CloudWatchLogsClient;
  constructor(region: string) {
    this.client = new CloudWatchLogsClient({
      region: region,
    });
  }

  listLogGroups = async (): Promise<LogGroup[]> => {
    const paginator = paginateDescribeLogGroups({ client: this.client }, {});
    const query = (page: DescribeLogGroupsCommandOutput) => {
      return page?.logGroups || [];
    };
    return await paginate(paginator, query);
  };
}
