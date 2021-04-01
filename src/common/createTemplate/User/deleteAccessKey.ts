import { IAM } from 'aws-sdk'
const iam = new IAM()

export const deleteAccessKey = async(accessKeyId: string, username:string) => {
    const deleteAccessKeyObj = {
        AccessKeyId: accessKeyId,
        UserName: username
    }
    return await iam.deleteAccessKey(deleteAccessKeyObj).promise()
}