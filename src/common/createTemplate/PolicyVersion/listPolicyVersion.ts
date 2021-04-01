import { IAM } from 'aws-sdk'
const iam = new IAM()

export const listPolicyVersion = async (policyarn:string) =>{
    const listPolicysVersion = {
        PolicyArn: policyarn
    };
        const policyVersion = await iam.listPolicyVersions(listPolicysVersion).promise()
        return policyVersion.Versions
}