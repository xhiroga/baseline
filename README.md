# baseline

Baseline of security, reliability, monitoring and cost.

## Useful commands

```shell
# set one of them
export CDK_BIN=baseline-root
export CDK_BIN=baseline-dynamic

# set environment variables
export $(cat .env)
```

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `yarn cdk deploy --context envName=${ENV_NAME} --context orgRootAccountId=${ORG_ROOT_ACCOUNT_ID}`      deploy this stack to your default AWS account/region
 * `yarn cdk diff --context envName=${ENV_NAME} --context orgRootAccountId=${ORG_ROOT_ACCOUNT_ID}`        compare deployed stack with current state
 * `yarn cdk synth --context envName=${ENV_NAME} --context orgRootAccountId=${ORG_ROOT_ACCOUNT_ID}`       emits the synthesized CloudFormation template

## Reference

### Styleguide

- [AWS CDKでクラウドアプリケーションを開発するためのベストプラクティス](https://aws.amazon.com/jp/blogs/news/best-practices-for-developing-cloud-applications-with-aws-cdk/)
- [Open CDK Guide](https://github.com/kevinslin/open-cdk)

### Official

- [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/index.html)
- [AWS CDK API Reference](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-construct-library.html)
