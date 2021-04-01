import { IAM } from 'aws-sdk'
const iam = new IAM()

export const deletePolicy = async(policyarn:string) =>{
    const deletePolicyObj = {
        PolicyArn: policyarn
    }
    return await iam.deletePolicy(deletePolicyObj).promise()
}