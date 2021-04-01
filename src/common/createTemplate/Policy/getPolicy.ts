import { IAM } from 'aws-sdk'
const iam = new IAM()

export const getPolicy = async (policyarn: string) => {
    const getPolicyObj = {
        PolicyArn: policyarn
    }
        const getPolicyArn = await iam.getPolicy(getPolicyObj).promise()
        return getPolicyArn.Policy.Arn
}