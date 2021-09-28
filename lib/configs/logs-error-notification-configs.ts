export type LogsErrorNotificationConfig = {
  logGroupNameFilter: RegExp;
  filterPattern: string;
};

export const logsErrorNotificationConfigs: LogsErrorNotificationConfig[] = [
  {
    logGroupNameFilter: /.+/,
    filterPattern:
      '?FATAL ?Fatal ?fatal ?PANIC ?Panic ?panic ?ERROR ?Error ?error ?WARN ?Warn ?warn',
  },
];
