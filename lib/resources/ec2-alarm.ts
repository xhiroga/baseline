import {
  Alarm,
  ComparisonOperator,
  Metric,
  TreatMissingData,
} from '@aws-cdk/aws-cloudwatch';
import { SnsAction } from '@aws-cdk/aws-cloudwatch-actions';
import { ITopic } from '@aws-cdk/aws-sns';
import { Construct } from '@aws-cdk/core';
import { Instance } from '@aws-sdk/client-ec2';

export interface Ec2AlarmProps {
  instance: Instance;
  topics: ITopic[];
}

export class Ec2Alarm extends Construct {
  constructor(scope: Construct, id: string, props: Ec2AlarmProps) {
    super(scope, id);
    const { instance, topics } = props;

    const alarm = new Alarm(this, `Ec2CpuUtilizationAlarm`, {
      metric: new Metric({
        metricName: 'CPUUtilization',
        namespace: 'AWS/EC2',
        statistic: 'Average',
        dimensions: {
          InstanceId: instance.InstanceId,
        },
      }),
      treatMissingData: TreatMissingData.MISSING,
      threshold: 95.45,
      evaluationPeriods: 1,
      comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
    });

    topics.forEach((topic) => {
      alarm.addAlarmAction(new SnsAction(topic));
    });
  }
}
