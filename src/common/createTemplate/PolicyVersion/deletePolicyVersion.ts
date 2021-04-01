import { IAM } from 'aws-sdk'
const iam = new IAM()

export const deletePolicyVersion = async (policyarn:string, versionid: string) => {
    const getDocument = {
        PolicyArn: policyarn,
        VersionId: versionid
      };
        return await iam.deletePolicyVersion(getDocument).promise()  
}