#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import 'source-map-support/register';
import { Ec2Api } from '../lib/api/ec2-api';
import { Ec2AlarmsStack } from '../lib/stacks/ec2-alarms-stack';

const synth = async () => {
  const app = new cdk.App();
  const regions = ['ap-northeast-1'];

  regions.forEach(async (region) => {
    const ec2Api = new Ec2Api(region);
    const ec2Instances = await ec2Api.describeInstances();
    new Ec2AlarmsStack(app, `${region}-Ec2AlarmsStack`, {
      env: { region },
      ec2Instances,
    });
  });
};
synth();
