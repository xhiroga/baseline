import * as awsLambda from 'aws-lambda';
import * as zlib from 'zlib';

exports.handler = async (
  event: awsLambda.CloudWatchLogsEvent,
  _context: awsLambda.Context,
  callback: awsLambda.Callback
) => {
  const logData: awsLambda.CloudWatchLogsDecodedData = JSON.parse(
    zlib.unzipSync(Buffer.from(event.awslogs.data, 'base64')).toString()
  );

  for await (const event of logData.logEvents) {
    // TODO
  }

  callback(null, 'OK');
};
