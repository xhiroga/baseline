import {
  DynamoDBClient,
  ListTablesCommandOutput,
  paginateListTables,
} from '@aws-sdk/client-dynamodb';
import { paginate } from '../util/paginate';

export class DynamoDBApi {
  private readonly client: DynamoDBClient;
  private readonly region: string;
  private readonly accountId: string;
  constructor(region: string, accountId: string) {
    this.client = new DynamoDBClient({
      region: region,
    });
    this.region = region;
    this.accountId = accountId;
  }

  listTableArns = async (): Promise<string[]> => {
    const paginator = paginateListTables({ client: this.client }, {});
    const query = (page: ListTablesCommandOutput) => {
      return (
        page?.TableNames?.map((table) =>
          getDynamoDBTableArn(table, this.region, this.accountId)
        ) || []
      );
    };
    return await paginate(paginator, query);
  };
}

const getDynamoDBTableArn = (
  tableName: string,
  region: string,
  accountId: string
): string => `arn:aws:dynamodb:${region}:${accountId}:table/${tableName}`;
