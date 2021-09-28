import {
  HostedZone,
  ListHostedZonesCommandOutput,
  ListResourceRecordSetsCommand,
  paginateListHostedZones,
  ResourceRecordSet,
  Route53Client,
  RRType,
} from '@aws-sdk/client-route-53';
import { paginate } from '../util/paginate';

type listResourceRecordSetsProps = {
  StartRecordName: string;
  StartRecordType: RRType | string;
  StartRecordIdentifier: string;
};

export class Route53Api {
  private readonly client: Route53Client;
  constructor(region: string) {
    this.client = new Route53Client({
      region: region,
    });
  }

  listPublicHostedZones = async (): Promise<HostedZone[]> => {
    const paginator = paginateListHostedZones({ client: this.client }, {});
    const query = (page: ListHostedZonesCommandOutput) => {
      return (
        page.HostedZones?.filter(
          (hostedZone) => hostedZone.Config?.PrivateZone !== true
        ) || []
      );
    };
    return await paginate(paginator, query);
  };

  listResourceRecordSets = async (
    hostedZone: HostedZone,
    start?: listResourceRecordSetsProps
  ): Promise<ResourceRecordSet[]> => {
    const command = new ListResourceRecordSetsCommand({
      HostedZoneId: hostedZone.Id,
      MaxItems: 200,
      ...(start ? start : {}),
    });
    const {
      ResourceRecordSets,
      NextRecordName,
      NextRecordType,
      NextRecordIdentifier,
      IsTruncated,
    } = await this.client.send(command);
    const resourceRecordSets = ResourceRecordSets ? ResourceRecordSets : [];
    const allRecordSets = resourceRecordSets.concat(
      IsTruncated && NextRecordName && NextRecordType && NextRecordIdentifier
        ? await this.listResourceRecordSets(hostedZone, {
            StartRecordName: NextRecordName,
            StartRecordType: NextRecordType,
            StartRecordIdentifier: NextRecordIdentifier,
          })
        : []
    );
    return allRecordSets;
  };
}

// このリポジトリでは、IPアドレスまたはCloudFrontでホストされているページを監視対象として認識する。
export const isRoutedToIpOrCloudFront = (record: ResourceRecordSet) => {
  const { AliasTarget, ResourceRecords } = record;
  const regexCf = new RegExp(/.cloudfront.net[.]*$/);
  const regexIp = new RegExp(
    /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/
  );
  return (
    (AliasTarget && AliasTarget.DNSName && regexCf.test(AliasTarget.DNSName)) ||
    (ResourceRecords &&
      ResourceRecords.some((resourceRecord) => {
        regexCf.test(resourceRecord.Value || '') ||
          regexIp.test(resourceRecord.Value || '');
      }))
  );
};
