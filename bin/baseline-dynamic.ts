#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import 'source-map-support/register';
import { DynamoDBApi } from '../lib/api/dynamodb-api';
import { Ec2Api } from '../lib/api/ec2-api';
import { LogsApi } from '../lib/api/logs-api';
import { isRoutedToIpOrCloudFront, Route53Api } from '../lib/api/route53-api';
import { StsApi } from '../lib/api/sts-api';
import { DynamoDBBackupStack } from '../lib/stacks/dynamodb-backup-stack';
import { Ec2AlarmsStack } from '../lib/stacks/ec2-alarms-stack';
import { LogsSubscriptionsStack } from '../lib/stacks/logs-subscription-stack';
import { Route53HealthCheckStack } from '../lib/stacks/route53-health-check-stack';
import { TopicsReferenceStack } from '../lib/stacks/topics-reference-stack';
import { flatten } from '../lib/util/flatten';

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

    const dynamodbApi = new DynamoDBApi(region, accountId);
    const tableArns = await dynamodbApi.listTableArns();
    new DynamoDBBackupStack(app, `${envName}-${region}-DynamoDBBackupStack`, {
      tableArns,
    });

    const route53Api = new Route53Api(region);
    const hostedZones = await route53Api.listPublicHostedZones();
    const resourceRecordSets = flatten(
      await Promise.all(
        hostedZones.map(
          async (hostedZone) =>
            await route53Api.listResourceRecordSets(hostedZone)
        )
      )
    );
    const targetRecords = resourceRecordSets.filter(isRoutedToIpOrCloudFront);
    new Route53HealthCheckStack(
      app,
      `${envName}-${region}-Route53HealthCheckStack`,
      { resourceRecordSets: targetRecords, topics }
    );
  });
};
synth();
