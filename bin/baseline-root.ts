#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import 'source-map-support/register';
import { CostAnomalySubscriptionsStack } from '../lib/stacks/cost-anomaly-subscriptions-stack';

const synth = async () => {
  const app = new cdk.App();
  const envName = app.node.tryGetContext('envName');

  new CostAnomalySubscriptionsStack(
    app,
    `${envName}-CostAnomalySubscriptionsStack`,
    { emails: [], topics: [] }
  );
};
synth();
