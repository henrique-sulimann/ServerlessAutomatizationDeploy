import { IAM } from 'aws-sdk'
const iam = new IAM()

export const getPolicyVersion = async (policyarn: string, versionid:string) => {
    const getDocument = {
        PolicyArn: policyarn,
        VersionId: versionid
      };
        const getVersionPolicy = await iam.getPolicyVersion(getDocument).promise()
        return decodeURIComponent(getVersionPolicy.PolicyVersion.Document)
}