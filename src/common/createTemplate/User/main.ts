import { listAttachedUserPolicies } from './listAttachedUserPolicies'
import { attachUserPolicy } from './AttachUserPolicy'
import { createUser } from './createUser'
import { accessKey } from './createAccessKey'
import { getUser } from './getUser'
export const check_user = async(service: string, env: string) => {
    const UserName = env+"-deploy-"+service
    const PolicyArn = "arn:aws:iam::132818155912:policy/"+env+"-deploy-"+service+"-policy"
    const userGet = await getUser(UserName)
    if(userGet == "arn:aws:iam::132818155912:user/"+env+"-deploy-"+service){
        console.log("Usuário já existe: \n"+userGet)
        console.log("Verificando se a policy em questão está attachado ao usuário")
        const listAttachedUserPolicy = await listAttachedUserPolicies(UserName)
        console.log(listAttachedUserPolicy.AttachedPolicies.length)
        console.log(listAttachedUserPolicy.AttachedPolicies)
        if (listAttachedUserPolicy.AttachedPolicies.length == 0){
            console.log("policy não está attachada, realizando o attach da mesma")
                await attachUserPolicy(PolicyArn,UserName)
                return "Usuário já existe e a policy não estava atachada, portanto, foi atachada com sucesso!" //Realizado o attach com sucesso!
        }else{
            for(let i of listAttachedUserPolicy.AttachedPolicies){
                if (i.PolicyName == env+"-deploy-"+service+"-policy"){
                    return "Usuário já existe e a policy já está atachada ao mesmo"
                }else{
                    console.log("policy não está attachada, realizando o attach da mesma")
                    await attachUserPolicy(PolicyArn,UserName)
                    return "Usuário já existe e a policy não estava atachada, portanto, foi atachada com sucesso!" //Realizado o attach com sucesso!
                }
            }
        }
    } else if (userGet == "Usuário não encontrado") {
        console.log("Usuário não existe, portanto, estamos realizando a criação do mesmo.")
        const criaUser = await createUser(UserName)
        console.log("Usuário criado com sucesso! "+criaUser)
        console.log("Criando as chaves de acesso")
        const createAccessKey = await accessKey(UserName)
        console.log("Realizado a criação das chaves de acesso com sucesso!\nAccess Key: "+(await createAccessKey).AccessKey.AccessKeyId+"\nSecret Key: "+createAccessKey.AccessKey.SecretAccessKey )
        console.log("Realizando o attach da policy ao usuário criado")
        const attachPolicy = await attachUserPolicy(PolicyArn,UserName)
        console.log("Realizado o attach da policy com sucesso! "+attachPolicy)
        return "Usuário não existe e foi criado com sucesso, Access key criada com sucesso e Policy atachada com sucesso!"
    }else{
        console.log("Não foi possível buscar o usuário!")
    }  
}