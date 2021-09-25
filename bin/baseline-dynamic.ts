#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import 'source-map-support/register';
import { Ec2Api } from '../lib/api/ec2-api';
import { LogsApi } from '../lib/api/logs-api';
import { Ec2AlarmsStack } from '../lib/stacks/ec2-alarms-stack';
import { TopicsReferenceStack } from '../lib/stacks/topics-reference-stack';

const synth = async () => {
  const app = new cdk.App();
  const envName = app.node.tryGetContext('envName');
  const regions = ['ap-northeast-1'];

  regions.forEach(async (region) => {
    const topicsReference = new TopicsReferenceStack(
      app,
      `${envName}-${region}-TopicReferenceStack`,
      { orgRootAccountId: app.node.tryGetContext('orgRootAccountId'), region }
    );

    const ec2Api = new Ec2Api(region);
    const ec2Instances = await ec2Api.describeInstances();
    new Ec2AlarmsStack(app, `${envName}-${region}-Ec2AlarmsStack`, {
      env: { region },
      ec2Instances,
      topics: topicsReference.topics,
    });

    const logsApi = new LogsApi(region);
    const logs = logsApi.listLogGroups();
  });
};
synth();
