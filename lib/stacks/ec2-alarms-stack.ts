import { ITopic } from '@aws-cdk/aws-sns';
import { Construct, Stack, StackProps } from '@aws-cdk/core';
import { Instance } from '@aws-sdk/client-ec2';
import { Ec2Alarm } from '../resources/ec2-alarm';

type Ec2AlarmsStackProps = {
  ec2Instances: Instance[];
  topics: ITopic[];
} & StackProps;

export class Ec2AlarmsStack extends Stack {
  constructor(scope: Construct, id: string, props: Ec2AlarmsStackProps) {
    super(scope, id, props);
    props.ec2Instances.forEach((instance) => {
      instance.InstanceId &&
        new Ec2Alarm(this, instance.InstanceId, {
          instance,
          topics: props.topics,
        });
    });
  }
}
