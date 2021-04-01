import { IAM } from 'aws-sdk'
const iam = new IAM()

export const attachUserPolicy = async (policyarn:string, username:string) => {
    const attachPolicyUser = {
        PolicyArn: policyarn,
        UserName: username
    }
        return await iam.attachUserPolicy(attachPolicyUser).promise()
}