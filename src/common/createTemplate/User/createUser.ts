import { IAM } from 'aws-sdk'
const iam = new IAM()

export const createUser = async (username:string) => {
    const userCreate = {
        UserName: username
    }
        const userArn = await iam.createUser(userCreate).promise()
        return userArn.User.Arn 
}