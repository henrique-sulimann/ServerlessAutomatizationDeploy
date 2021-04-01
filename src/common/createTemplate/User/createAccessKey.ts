import { IAM } from 'aws-sdk'
const iam = new IAM()

export const accessKey = async (username:string) => {
    const accessKeyObj = {
        UserName: username
    }
        return await iam.createAccessKey(accessKeyObj).promise() 
}