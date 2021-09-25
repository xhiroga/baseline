export type LogsErrorNotificationConfig = {
  logGroupNameFilter: RegExp;
  logFilter: RegExp;
  topicArnFilter: RegExp;
};

export const logsErrorNotificationConfigs: LogsErrorNotificationConfig[] = [
  {
    logGroupNameFilter: /.+/,
    logFilter:
      /(?<!(DEBUG|INFO|WARN)[\S\s]+)(FATAL|Fatal|fatal|PANIC|Panic|panic|ERROR|Error|error)/,
    topicArnFilter: /DefaultNotificationTopic/,
  },
];
