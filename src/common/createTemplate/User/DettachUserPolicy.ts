import { IAM } from 'aws-sdk'
const iam = new IAM()

export const dettachUserPolicy = async(policyarn:string, username:string) => {
    const dettachUserPolicyObj = {
        PolicyArn: policyarn,
        UserName: username
    }
    return await iam.detachUserPolicy(dettachUserPolicyObj).promise()
}