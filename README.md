# baseline

Baseline of security, reliability, monitoring and cost.

## Notification

2021-09-28 16:05~より、[#AWSDevDay](https://twitter.com/search?q=%23AWSDevDay&src=recent_search_click&f=live)にて本リポジトリを用いたセッション、[C-3 [AWS CDK] 1,000+のCloudWatch Alarmを自動生成する技術](https://aws.amazon.com/jp/about-aws/events/2021/devday)が開催されます。ぜひご視聴くださいませ！

なお、登壇資料は[こちら](https://speakerdeck.com/hiroga/aws-cdk-technics-to-generate-1-000-plus-cloudwatch-alarms)です。

## Sponsored

本リポジトリの内容は、保険SaaSを提供する[justInCase](https://justincase.jp/)での取り組みを基にしています。  
[絶賛採用中](https://justincase.jp/careers)ですので、ご興味を持っていただけた方はぜひ面談しましょう！

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
