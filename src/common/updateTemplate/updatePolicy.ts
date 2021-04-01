//import { IAM } from 'aws-sdk'
import { check_version } from '../createTemplate/PolicyVersion/main'
import { getPolicy } from '../createTemplate/Policy/getPolicy'
export const updatePolicy = async(service: string,env: string, template_default: object) => {
    const PolicyArn = "arn:aws:iam::132818155912:policy/"+env+"-deploy-"+service+"-policy"
    try {
        const check_policy = await getPolicy(PolicyArn)
        console.log("Policy já existe\n"+check_policy)
        console.log("verificando se a Policy criada é a mesma que a Policy em questão")
        const check_policy_version = await check_version(service,env,template_default)
        if (check_policy_version == "Policy Version é igual a Policy solicitada"){
            console.log("Policy são iguais, portanto, não precisa de update")
            return "Policy são iguais, portanto, não precisa de update"
        }else if (check_policy_version == "Policy Version não é igual a Policy solicitada portanto foi atualizada com sucesso!"){
            console.log("Não são iguais portanto, criamos uma nova policy version com a atualização")
            return "Não são iguais portanto, criamos uma nova policy version com a atualização"
        }else{
           console.log("Erro: "+check_policy_version)
        }    
    } catch (error) {
        console.log("Policy não está criada: "+error)
    } 
}