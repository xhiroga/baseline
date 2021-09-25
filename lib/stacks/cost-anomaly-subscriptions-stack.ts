import { CfnAnomalyMonitor, CfnAnomalySubscription } from '@aws-cdk/aws-ce';
import { Topic } from '@aws-cdk/aws-sns';
import { Construct, Stack, StackProps } from '@aws-cdk/core';
import { costAnomalySubscriptionConfigs } from '../configs/cost-anomaly-subscription-configs';

type CostAnomalySubscriptionStacksProps = {
  emails: string[];
  topics: Topic[];
} & StackProps;

export class CostAnomalySubscriptionsStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props: CostAnomalySubscriptionStacksProps
  ) {
    super(scope, id, props);
    const { emails, topics } = props;

    const awsServiceMonitor = new CfnAnomalyMonitor(
      this,
      'monitor-aws-services',
      {
        monitorName: 'monitor-aws-services',
        monitorType: 'DIMENSIONAL',
        monitorDimension: 'SERVICE',
      }
    );

    costAnomalySubscriptionConfigs.forEach((config) => {
      new CfnAnomalySubscription(
        this,
        `anomaly-subscription-${config.frequency}-${config.thresholdDollar}`,
        {
          frequency: config.frequency,
          monitorArnList: [awsServiceMonitor.attrMonitorArn],
          subscribers: [
            ...emails.map((email) => ({
              type: 'EMAIL',
              address: email,
            })),
            ...topics.map((topic) => ({
              type: 'SNS',
              address: topic.topicArn,
            })),
          ],
          subscriptionName: `anomaly-subscription-${config.frequency}-${config.thresholdDollar}`,
          threshold: config.thresholdDollar,
        }
      );
    });
  }
}
