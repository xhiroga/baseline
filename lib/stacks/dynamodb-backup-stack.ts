import { BackupPlan, BackupResource, BackupVault } from '@aws-cdk/aws-backup';
import { ITopic } from '@aws-cdk/aws-sns';
import { Construct, RemovalPolicy, Stack, StackProps } from '@aws-cdk/core';
import { backupPlanConfigs } from '../configs/backup-plan-configs';

type DynamoDBBackupStackProps = {
  tableArns: string[];
  topic?: ITopic; // 2021-09-26 cannot put to another aws account.
} & StackProps;

export class DynamoDBBackupStack extends Stack {
  constructor(scope: Construct, id: string, props: DynamoDBBackupStackProps) {
    super(scope, id, props);
    const { tableArns, topic } = props;

    const vault = new BackupVault(this, 'BackupVault', {
      removalPolicy: RemovalPolicy.RETAIN,
      ...(topic ? { notificationTopic: topic } : {}),
    });

    backupPlanConfigs.forEach((config) => {
      const plan = new BackupPlan(this, `BackupPlan${config.name}`, {
        backupVault: vault,
        backupPlanRules: config.backupPlanRules,
      });

      plan.addSelection(`BackupPlan${config.name}`, {
        resources: tableArns
          .filter((tableArn) => config.topicArnFilter.test(tableArn))
          .map((tableArn) => BackupResource.fromArn(tableArn)),
      });
    });
  }
}
