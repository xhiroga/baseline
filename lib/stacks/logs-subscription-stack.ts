import { ITopic } from '@aws-cdk/aws-sns';
import { Construct, Stack, StackProps } from '@aws-cdk/core';
import { LogGroup } from '@aws-sdk/client-cloudwatch-logs';
import { LogsErrorNotificationConfig } from '../configs/logs-error-notification-configs';

type LogsSubscriptionStackProps = {
  logs: LogGroup[];
  topics: ITopic[];
  configs: LogsErrorNotificationConfig[];
} & StackProps;

export class LogsSubscriptionStack extends Stack {
  constructor(scope: Construct, id: string, props: LogsSubscriptionStackProps) {
    super(scope, id, props);
    const { logs, topics, configs } = props;
    logs.forEach((log) => {
      const config = configs.find(
        (config) => log.logGroupName && config.logFilter.test(log.logGroupName)
      );
      const topic = topics.find((topic) =>
        config?.topicArnFilter.test(topic.topicName)
      );

      // TODO
    });
  }
}
