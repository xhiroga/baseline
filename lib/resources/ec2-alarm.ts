import {
  Alarm,
  ComparisonOperator,
  Metric,
  TreatMissingData,
} from '@aws-cdk/aws-cloudwatch';
import { Construct } from '@aws-cdk/core';
import { Instance } from '@aws-sdk/client-ec2';

export interface Ec2AlarmProps {
  instance: Instance;
}

export class Ec2Alarm extends Construct {
  constructor(scope: Construct, id: string, props: Ec2AlarmProps) {
    super(scope, id);

    new Alarm(this, `Ec2CpuUtilizationAlarm`, {
      metric: new Metric({
        metricName: 'CPUUtilization',
        namespace: 'AWS/EC2',
        statistic: 'Average',
        dimensions: {
          InstanceId: props.instance.InstanceId,
        },
      }),
      treatMissingData: TreatMissingData.MISSING,
      threshold: 95.45,
      evaluationPeriods: 1,
      comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
    });
  }
}
