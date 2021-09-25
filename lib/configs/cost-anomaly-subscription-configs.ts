type CostAnomalySubscriptionConfig = {
  readonly frequency: 'DAILY' | 'WEEKLY' | 'IMMEDIATE';
  readonly thresholdDollar: number;
};

export const costAnomalySubscriptionConfigs: readonly CostAnomalySubscriptionConfig[] =
  [
    {
      frequency: 'DAILY',
      thresholdDollar: 20,
    },
    {
      frequency: 'WEEKLY',
      thresholdDollar: 20,
    },
    {
      frequency: 'IMMEDIATE',
      thresholdDollar: 10,
    },
  ] as const;
