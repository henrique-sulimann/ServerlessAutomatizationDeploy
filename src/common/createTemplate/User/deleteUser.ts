import { IAM } from 'aws-sdk'
const iam = new IAM()

export const deleteUser = async (username:string) => {
    const deleteUserObj = {
        UserName: username
    }
        return await iam.deleteUser(deleteUserObj).promise()   
}