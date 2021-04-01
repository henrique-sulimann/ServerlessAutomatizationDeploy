//import { IAM } from 'aws-sdk'
import { check_version } from './PolicyVersion/main'
import { check_user } from './User/main'
import { check_repo } from './Repository/main'
import { getPolicy } from './Policy/getPolicy'
import { createPolicy } from './Policy/createPolicy'
//const iam = new IAM()
export const main = async(service: string,env: string, template_default: object,cloudformation:string) => {
    const PolicyArn = "arn:aws:iam::132818155912:policy/"+env+"-deploy-"+service+"-policy"
    const PolicyDocument = JSON.stringify(template_default)
    const PolicyName =  env+"-deploy-"+service+"-policy"
    const Tags = [
            {
                Key: "Name",
                Value: env+"-deploy-"+service+"-policy"
            }
        ]
    try {
    const check_policy = await getPolicy(PolicyArn)
      console.log("policy já existe...\n"+check_policy)
      console.log("Verificando se a policy criada é a mesma que a policy em questão")
      const check_policy_version = await check_version(service,env,template_default)
      if (check_policy_version == "Policy Version é igual a Policy solicitada"){
          console.log("Policy são iguais, portanto, não precisam ser criadas")
      }else if (check_policy_version == "Policy Version não é igual a Policy solicitada portanto foi atualizada com sucesso!"){
          console.log("Não são iguais portanto, criamos uma nova policy version com a atualização")
      }else{
          console.log("Erro: "+check_policy_version)
      }
      console.log("verificando se o usuário já existe")
        const user_check = await check_user(service,env)
        if(user_check == "Usuário já existe e a policy não estava atachada, portanto, foi atachada com sucesso!"){
            console.log("Usuário já existia e Policy não estava atachada e foi atacha ao mesmo")
        }else if (user_check == "Usuário já existe e a policy já está atachada ao mesmo"){
            console.log("Usuário já existia e policy já estava atachada")
        }else if (user_check == "Usuário não existe e foi criado com sucesso, Access key criada com sucesso e Policy atachada com sucesso!"){
            console.log("Usuário não existia e Foi realizado a criação do mesmo com sucesso! e Foi realizado a criação das access keys e foi atachado a policy ao mesmo!")
        }
        const repo_check = await check_repo(service,cloudformation)
        if (repo_check == "Repositório e deploy.sh criados e o arquivo cloudformation não estava criado e foi criado com sucesso!"){
            console.log("Repositório e arquivo deploy.sh já existem e o arquivo cloud-formation foi criado com sucesso!")
        }else if (repo_check == "Repositório, deploy.sh e cloud-formatino.yaml já existem"){
            console.log("Repositório, arquivo deploy.sh e cloud-formation.yaml já existem!")
        }else if (repo_check == "Repositório estava criado e os arquivos deploy.sh e cloud-formation.yaml não estavam criados e foram criados com sucesso!"){
            console.log("Repositório criado e os arquivos deploy.sh e cloud-formation.yaml foram criados com sucesso!")
        }else if (repo_check == "Repositório, arquivo deploy.sh e cloud-formation foram criados com sucesso!"){
            console.log("Repositório, arquivo deploy.sh e cloud-formation foram criados com sucesso!")
        }
        return {
            policy: "ja existe",
            policy_version: check_policy_version,
            user: user_check,
            repo: repo_check
        };
    } catch (error) {
        console.log("erro: "+error)
        console.log("Policy não existe, portanto, estamos realizando a criação da mesma")
        const createPolice = await createPolicy(PolicyDocument,PolicyName,Tags)
        console.log("Policy criada com sucesso, verificando se o usuário já existe! "+createPolice)
        console.log("verificando se o usuário já existe")
        const user_check = await check_user(service,env)
        if(user_check == "Usuário já existe e a policy não estava atachada, portanto, foi atachada com sucesso!"){
            console.log("Usuário já existia\nPolicy não estava atachada e foi atacha ao mesmo")
        }else if (user_check == "Usuário já existe e a policy já está atachada ao mesmo"){
            console.log("Usuário já existia\npolicy já estava atachada")
        }else if (user_check == "Usuário não existe e foi criado com sucesso, Access key criada com sucesso e Policy atachada com sucesso!"){
            console.log("Usuário não existia\nFoi realizado a criação do mesmo com sucesso!\nFoi realizado a criação das access keys\nfoi atachado a policy ao mesmo!")
        }
        const repo_check = await check_repo(service,cloudformation)
        if (repo_check == "Repositório e deploy.sh criados e o arquivo cloudformation não estava criado e foi criado com sucesso!"){
            console.log("Repositório e arquivo deploy.sh já existem e o arquivo cloud-formation foi criado com sucesso!")
        }else if (repo_check == "Repositório, deploy.sh e cloud-formatino.yaml já existem"){
            console.log("Repositório, arquivo deploy.sh e cloud-formation.yaml já existem!")
        }else if (repo_check == "Repositório estava criado e os arquivos deploy.sh e cloud-formation.yaml não estavam criados e foram criados com sucesso!"){
            console.log("Repositório criado e os arquivos deploy.sh e cloud-formation.yaml foram criados com sucesso!")
        }else if (repo_check == "Repositório, arquivo deploy.sh e cloud-formation foram criados com sucesso!"){
            console.log("Repositório, arquivo deploy.sh e cloud-formation foram criados com sucesso!")
        }
        return {
            policy: "não existe e foi criada com sucesso",
            user: user_check,
            repo: repo_check
        };
    }
}