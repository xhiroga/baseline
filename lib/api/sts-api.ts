import { GetCallerIdentityCommand, STSClient } from '@aws-sdk/client-sts';

export class StsApi {
  private readonly client: STSClient;
  constructor() {
    this.client = new STSClient({});
  }

  getAccountId = async (): Promise<string> => {
    const { Account } = await this.client.send(
      new GetCallerIdentityCommand({})
    );
    if (Account === undefined) {
      throw new Error();
    }
    return Account;
  };
}
