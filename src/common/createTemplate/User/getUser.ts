import { IAM } from 'aws-sdk'
const iam = new IAM()

export const getUser = async(username:string) => {
    const getUser = {
        UserName: username
    }
    try {
        const userArn = await iam.getUser(getUser).promise()
        return userArn.User.Arn
    } catch (error) {
        return "Usuário não encontrado"
    }
        
}