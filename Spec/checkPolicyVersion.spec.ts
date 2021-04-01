import { deletePolicy } from '../src/common/createTemplate/Policy/deletePolicy'
import { deleteUser } from '../src/common/createTemplate/User/deleteUser'
import { default_template } from '../src/common/template_default/template_default'
import { main } from '../src/common/createTemplate/main'
import { dettachUserPolicy } from '../src/common/createTemplate/User/DettachUserPolicy'
import { getAccessKey } from '../src/common/createTemplate/User/getAccessKey'
import { deleteAccessKey } from '../src/common/createTemplate/User/deleteAccessKey'
import { deleteRepo } from '../src/common/createTemplate/Repository/deleteRepo'
import { listPolicyVersion } from '../src/common/createTemplate/PolicyVersion/listPolicyVersion'
import { deletePolicyVersion } from '../src/common/createTemplate/PolicyVersion/deletePolicyVersion'
test("Testa PolicyVersion é a mesma que o template_default, caso não, terá que ser criado", async () =>{
    const PolicyArn = "arn:aws:iam::132818155912:policy/Prod-deploy-unitTestJestPolicyVersion-policy"
    const temp = await default_template("unitTestJestPolicyVersion","Prod",["ecs","logs","loadbalancer"])
    const temp1 = await default_template("unitTestJestPolicyVersion","Prod",["ecs","logs"])
    await main("unitTestJestPolicyVersion","Prod",temp)
    const check = await main("unitTestJestPolicyVersion","Prod",temp1) 
    expect(check.policy).toEqual("ja existe")
    expect(check.policy_version).toEqual("Policy Version não é igual a Policy solicitada portanto foi atualizada com sucesso!")
    expect(check.repo).toEqual("Repositório e arquivo já existem")
    expect(check.user).toEqual("Usuário já existe e a policy já está atachada ao mesmo")
    const check_policy_document = await listPolicyVersion(PolicyArn)
    for (let e of check_policy_document){
        const VersionId = e.VersionId
        if (e.IsDefaultVersion != true){
            await deletePolicyVersion(PolicyArn,VersionId)
            console.log("policy version não é a Default, portanto, estamos removendo a mesma")
            console.log("policy version excluida foi: "+e.VersionId)
        }
    }
    await dettachUserPolicy("arn:aws:iam::132818155912:policy/Prod-deploy-unitTestJestPolicyVersion-policy","Prod-deploy-unitTestJestPolicyVersion")
    const teste = await getAccessKey("Prod-deploy-unitTestJestPolicyVersion")
    for (let i of teste){
        await deleteAccessKey(i.AccessKeyId,"Prod-deploy-unitTestJestPolicyVersion")
    }
    await deleteUser("Prod-deploy-unitTestJestPolicyVersion")
    await deletePolicy("arn:aws:iam::132818155912:policy/Prod-deploy-unitTestJestPolicyVersion-policy")
    await deleteRepo("unitTestJestPolicyVersion")
})
