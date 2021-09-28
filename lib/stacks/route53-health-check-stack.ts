import { ITopic, Topic } from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import { StackProps } from '@aws-cdk/core';
import { ResourceRecordSet } from '@aws-sdk/client-route-53';
import { Route53HealthCheckAlarm } from '../resources/route53-health-check-alarm';

export type Route53HealthCheckStackProps = {
  resourceRecordSets: ResourceRecordSet[];
  topics: ITopic[];
} & StackProps;

export class Route53HealthCheckStack extends cdk.Stack {
  public readonly healthCheckTopic: Topic;
  constructor(
    scope: cdk.Construct,
    id: string,
    props: Route53HealthCheckStackProps
  ) {
    super(scope, id, props);
    const { resourceRecordSets, topics } = props;

    resourceRecordSets.map((record) => {
      const domain = record.Name;
      domain &&
        new Route53HealthCheckAlarm(this, `Route53HealthCheckAlarm-${domain}`, {
          domain,
          topics,
        });
    });
  }
}
