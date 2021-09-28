import { ITopic } from '@aws-cdk/aws-sns';
import { Construct, Stack, StackProps } from '@aws-cdk/core';
import { Instance } from '@aws-sdk/client-ec2';
import { Ec2Alarm } from '../resources/ec2-alarm';

type Ec2AlarmsStackProps = {
  instances: Instance[];
  topics: ITopic[];
} & StackProps;

export class Ec2AlarmsStack extends Stack {
  constructor(scope: Construct, id: string, props: Ec2AlarmsStackProps) {
    super(scope, id, props);
    // 引数で渡されたEC2インスタンス1件ごとに、CloudWatch MetricsとAlarmを作成
    props.instances.forEach((instance) => {
      instance.InstanceId &&
        new Ec2Alarm(this, instance.InstanceId, {
          instance,
          topics: props.topics,
        });
    });
  }
}
