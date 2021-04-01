import { IAM } from 'aws-sdk'
const iam = new IAM()

export const createPolicy = async (policydocument:string, policyname:string,tags:any[]) => {
    const createPolicyObj = {
        PolicyDocument: policydocument,
        PolicyName: policyname,
        Tags: tags
    };
        const policyArn = await iam.createPolicy(createPolicyObj).promise()
        return policyArn.Policy.Arn  
}