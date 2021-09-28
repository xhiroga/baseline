#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import 'source-map-support/register';
import { DynamoDBApi } from '../lib/api/dynamodb-api';
import { Ec2Api } from '../lib/api/ec2-api';
import { LogsApi } from '../lib/api/logs-api';
import { StsApi } from '../lib/api/sts-api';
import { DynamoDBBackupStack } from '../lib/stacks/dynamodb-backup-stack';
import { Ec2AlarmsStack } from '../lib/stacks/ec2-alarms-stack';
import { LogsSubscriptionsStack } from '../lib/stacks/logs-subscription-stack';
import { TopicsReferenceStack } from '../lib/stacks/topics-reference-stack';

const synth = async () => {
  const app = new cdk.App();
  const envName = app.node.tryGetContext('envName');
  const regions = ['ap-northeast-1'];
  const accountId = await new StsApi().getAccountId();

  regions.forEach(async (region) => {
    const topicsReference = new TopicsReferenceStack(
      app,
      `${envName}-${region}-TopicReferenceStack`,
      { orgRootAccountId: app.node.tryGetContext('orgRootAccountId'), region }
    );
    const topics = topicsReference.topics;

    const ec2Api = new Ec2Api(region);

    // 1. APIからEC2インスタンスを一括取得
    const instances = await ec2Api.describeInstances();

    // 2. EC2インスタンスごとにCloudWatch Metricsを設定（実際の処理はスタック内）
    new Ec2AlarmsStack(app, `${envName}-${region}-Ec2AlarmsStack`, {
      env: { region },
      instances,
      topics,
    });

    const dynamodbApi = new DynamoDBApi(region, accountId);
    const tableArns = await dynamodbApi.listTableArns();
    new DynamoDBBackupStack(app, `${envName}-${region}-DynamoDBBackupStack`, {
      tableArns,
    });

    const logsApi = new LogsApi(region);
    const logs = await logsApi.listLogGroups();
    new LogsSubscriptionsStack(
      app,
      `${envName}-${region}-LogsSubscriptionStack`,
      {
        env: { region },
        logs,
        topics,
        slackWebhookPath: 'dummyPath',
      }
    );
  });
};
synth();
