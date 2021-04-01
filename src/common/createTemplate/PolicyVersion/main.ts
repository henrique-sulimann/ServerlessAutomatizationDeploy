import { getPolicyVersion } from './getPolicyVersion'
import { deletePolicyVersion } from './deletePolicyVersion'
import { createPolicy } from './createPolicyVersion'
import { listPolicyVersion } from './listPolicyVersion'
export const check_version = async(service: string,env: string,template_default:object) => {
    const PolicyArn = "arn:aws:iam::132818155912:policy/"+env+"-deploy-"+service+"-policy"
    const PolicyDocument =  JSON.stringify(template_default)
    const SetAsDefault =  true
        const check_policy_document = await listPolicyVersion(PolicyArn)
        try {
            for (let e of check_policy_document){
                const VersionId = e.VersionId
                if (e.IsDefaultVersion != true){
                    await deletePolicyVersion(PolicyArn,VersionId)
                    console.log("policy version não é a Default, portanto, estamos removendo a mesma")
                    console.log("policy version excluida foi: "+e.VersionId)
                }
            }
            for (let i of await check_policy_document){
                    const VersionId = i.VersionId
                if (i.IsDefaultVersion == true ){
                    const getDoc = await getPolicyVersion(PolicyArn, VersionId)
                    if(getDoc === JSON.stringify(template_default)){
                        return "Policy Version é igual a Policy solicitada"
                    }else{
                        try {
                            await createPolicy(PolicyArn,PolicyDocument,SetAsDefault)
                            return "Policy Version não é igual a Policy solicitada portanto foi atualizada com sucesso!"
                        } catch (error) {
                            return "Erro na criação da policy Version: "+error
                        }  
                    }
                }
            }
        } catch (error) {
            console.log("Não foi possível verificar as Policies Versions e nem atualizar as mesmas pelo seguinte problema:\n"+error)
        }
    }