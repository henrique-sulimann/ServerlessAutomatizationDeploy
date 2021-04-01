import { IAM } from 'aws-sdk'
const iam = new IAM()

export const getAccessKey = async(username:string) => {
    const getAccessKeyObj = {
        UserName: username
    }
    const access = await iam.listAccessKeys(getAccessKeyObj).promise()
    return access.AccessKeyMetadata
}