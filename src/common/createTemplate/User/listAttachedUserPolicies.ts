import { IAM } from 'aws-sdk'
const iam = new IAM()

export const listAttachedUserPolicies = async (username: string) => {
    const getUser = {
        UserName: username
    }
        return await iam.listAttachedUserPolicies(getUser).promise()   
}