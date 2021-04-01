import { IAM } from 'aws-sdk'
const iam = new IAM()

export const createPolicy = async (policyarn:string, policydocument:string, setasdefault:boolean) => {
    const createPolicyObj = {
        PolicyArn: policyarn,
        PolicyDocument: policydocument,
        SetAsDefault: setasdefault
    }
        return await iam.createPolicyVersion(createPolicyObj).promise()  
}