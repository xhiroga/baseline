import {
  DescribeInstancesCommandOutput,
  EC2Client,
  Filter,
  Instance,
  paginateDescribeInstances,
} from '@aws-sdk/client-ec2';
import { flatten } from '../util/flatten';
import { paginate } from '../util/paginate';

export class Ec2Api {
  private readonly client: EC2Client;

  constructor(region: string) {
    this.client = new EC2Client({
      region: region,
    });
  }
  describeInstances = async (filters?: Filter[]): Promise<Instance[]> => {
    const paginator = paginateDescribeInstances(
      {
        client: this.client,
      },
      {
        Filters: filters,
      }
    );
    const query = (page: DescribeInstancesCommandOutput) =>
      flatten(
        page.Reservations?.map((reservation) => reservation.Instances || []) ||
          []
      );
    return await paginate(paginator, query);
  };
}

export const isNotSpotFleet = (instance: Instance): boolean => {
  return (
    (instance.Tags?.filter((tag) => tag.Key === 'aws:ec2spot:fleet-request-id')
      .length || 0) === 0
  );
};

export const getEc2InstanceArn = (
  instance: Instance,
  region: string,
  accountId: string
): string => {
  return `arn:aws:ec2:${region}:${accountId}:instance/${instance.InstanceId}`;
};
