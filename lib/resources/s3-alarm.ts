import {
  CfnAlarm,
  CfnAnomalyDetector,
  ComparisonOperator,
} from '@aws-cdk/aws-cloudwatch';
import { ITopic } from '@aws-cdk/aws-sns';
import { Construct, Duration } from '@aws-cdk/core';
import { Bucket } from '@aws-sdk/client-s3';

export type S3AlarmProps = {
  bucket: Bucket;
  topics: ITopic[];
};

export class S3Alarm extends Construct {
  constructor(scope: Construct, id: string, props: S3AlarmProps) {
    super(scope, id);
    const { bucket, topics } = props;
    // 2021-09-27現在、AnomalyDetectorはCDKのL2 Constructとして実装されていない。
    const ad = new CfnAnomalyDetector(this, `AnomalyDetectorBucketSizeBytes`, {
      metricName: 'BucketSizeBytes',
      namespace: 'AWS/S3',
      stat: 'Average',
    });
    new CfnAlarm(this, `AnomalyDetectorBucketSizeBytesAlarm`, {
      alarmActions: topics.map((topic) => topic.topicArn),
      // AnomalyDetectorに対するアラームは複雑なので、一度手動で作成してからCLIなどでDescribeするのがオススメ
      metrics: [
        {
          expression: 'ANOMALY_DETECTION_BAND(m1, 2)',
          id: 'ad1',
        },
        {
          id: 'm1',
          metricStat: {
            metric: {
              metricName: ad.metricName,
              namespace: ad.namespace,
              dimensions: [
                {
                  name: 'StorageType',
                  value: 'StandardStorage',
                },
                {
                  name: 'BucketName',
                  value: bucket.Name || '',
                },
              ],
            },
            period: Duration.days(1).toSeconds(),
            stat: 'Average',
          },
        },
      ],
      comparisonOperator:
        ComparisonOperator.LESS_THAN_LOWER_OR_GREATER_THAN_UPPER_THRESHOLD,
      thresholdMetricId: 'ad1',
      evaluationPeriods: 1,
    });
  }
}
