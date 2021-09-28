import { BackupPlanRule } from '@aws-cdk/aws-backup';
import { Schedule } from '@aws-cdk/aws-events';
import { Duration } from '@aws-cdk/core';

type BackupPlanConfig = {
  name: string;
  backupPlanRules: BackupPlanRule[];
  resourceArnFilter: RegExp;
  topicArnFilter: RegExp;
};

export const backupPlanConfigs: BackupPlanConfig[] = [
  {
    name: 'DailyBackups',
    backupPlanRules: [
      new BackupPlanRule({
        ruleName: 'DailyBackups',
        deleteAfter: Duration.days(30),
        scheduleExpression: Schedule.cron({
          minute: '0',
          hour: '15', // 0:00 JST
        }),
      }),
    ],
    resourceArnFilter: /.+/,
    topicArnFilter: /.+DefaultNotificationTopic/,
  },
];
