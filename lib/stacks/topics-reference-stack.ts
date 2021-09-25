import { ITopic, Topic } from '@aws-cdk/aws-sns';
import { Construct, Stack, StackProps } from '@aws-cdk/core';

type TopicsReferenceStackProps = {
  orgRootAccountId: string;
  region: string;
} & StackProps;

export class TopicsReferenceStack extends Stack {
  topics: ITopic[];
  constructor(scope: Construct, id: string, props: TopicsReferenceStackProps) {
    super(scope, id);
    const { orgRootAccountId: organizationRootAccountId, region } = props;

    this.topics = [
      Topic.fromTopicArn(
        this,
        'DefaultNotificationTopic',
        `arn:aws:sns:${region}:${organizationRootAccountId}:DefaultNotificationTopic`
      ),
    ];
  }
}
