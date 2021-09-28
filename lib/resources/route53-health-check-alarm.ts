import {
  Alarm,
  ComparisonOperator,
  Metric,
  TreatMissingData,
} from '@aws-cdk/aws-cloudwatch';
import { SnsAction } from '@aws-cdk/aws-cloudwatch-actions';
import { CfnHealthCheck } from '@aws-cdk/aws-route53';
import { ITopic } from '@aws-cdk/aws-sns';
import { Construct, Duration } from '@aws-cdk/core';

export type Route53HealthCheckAlarmProps = {
  domain: string;
  topics: ITopic[];
};

export class Route53HealthCheckAlarm extends Construct {
  constructor(
    scope: Construct,
    id: string,
    props: Route53HealthCheckAlarmProps
  ) {
    super(scope, id);
    const { domain, topics } = props;

    const healthCheck = new CfnHealthCheck(this, 'HealthCheck', {
      healthCheckConfig: {
        enableSni: true,
        failureThreshold: 3,
        fullyQualifiedDomainName: domain,
        inverted: false,
        measureLatency: false,
        requestInterval: 30,
        resourcePath: '/',
        port: 443,
        type: 'HTTPS',
      },
    });

    const alarm = new Alarm(this, `Route53HealthCheckAlarm`, {
      metric: new Metric({
        metricName: 'HealthCheckStatus',
        namespace: 'AWS/Route53',
        dimensions: { HealthCheckId: healthCheck.attrHealthCheckId },
        period: Duration.seconds(60),
        statistic: 'Average',
      }),
      comparisonOperator: ComparisonOperator.LESS_THAN_THRESHOLD,
      evaluationPeriods: 1,
      threshold: 1,
      treatMissingData: TreatMissingData.MISSING,
    });

    topics.forEach((topic) => {
      alarm.addAlarmAction(new SnsAction(topic));
    });
  }
}
