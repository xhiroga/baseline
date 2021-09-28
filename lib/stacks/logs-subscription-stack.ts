import { ServicePrincipal } from '@aws-cdk/aws-iam';
import { Runtime } from '@aws-cdk/aws-lambda';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import {
  FilterPattern,
  LogGroup as LogGroupConstruct,
  SubscriptionFilter,
} from '@aws-cdk/aws-logs';
import { LambdaDestination } from '@aws-cdk/aws-logs-destinations';
import { ITopic } from '@aws-cdk/aws-sns';
import { Construct, Stack, StackProps } from '@aws-cdk/core';
import { LogGroup } from '@aws-sdk/client-cloudwatch-logs';
import { logsErrorNotificationConfigs } from '../configs/logs-error-notification-configs';
import path = require('path');

type LogsSubscriptionsStackProps = {
  logs: LogGroup[];
  topics: ITopic[];
  slackWebhookPath: string;
} & StackProps;

export class LogsSubscriptionsStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props: LogsSubscriptionsStackProps
  ) {
    super(scope, id, props);
    const { logs, topics, slackWebhookPath } = props;

    const fn = new NodejsFunction(this, 'LogsSubscription', {
      entry: path.join(
        __dirname,
        '../../functions/logs-subscription/lambda-handler.ts'
      ),
      handler: 'handler',
      runtime: Runtime.NODEJS_14_X,
      environment: {
        SLACK_WEBHOOK_PATH: slackWebhookPath,
      },
    });
    fn.addPermission('InvokedByCloudWatchLogs', {
      principal: new ServicePrincipal('logs.amazonaws.com'),
      action: 'lambda:InvokeFunction',
      sourceArn: `arn:aws:logs:${this.region}:${this.account}:log-group:*:*`,
    });

    logs.forEach((log) => {
      const logGroupName = log.logGroupName;
      const config = logsErrorNotificationConfigs.find(
        (config) => logGroupName && config.logGroupNameFilter.test(logGroupName)
      );
      if (logGroupName === undefined || config === undefined) {
        return;
      }

      topics.find((topic) => config.logGroupNameFilter.test(topic.topicName));
      const logGroup = LogGroupConstruct.fromLogGroupName(
        this,
        `LogGroup-${logGroupName}`,
        logGroupName
      );
      new SubscriptionFilter(this, `SubscriptionFilter-${logGroupName}`, {
        destination: new LambdaDestination(fn, {
          addPermissions: false, // Lambda の ResourcePolicy がSubscriptionFilter の数だけ膨張し、サイズの制限を超えてしまうことを回避する。
        }),
        filterPattern: FilterPattern.literal(config.filterPattern),
        logGroup: logGroup,
      });
    });
  }
}
