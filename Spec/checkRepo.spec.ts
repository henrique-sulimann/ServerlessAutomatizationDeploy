import { deletePolicy } from '../src/common/createTemplate/Policy/deletePolicy'
import { deleteUser } from '../src/common/createTemplate/User/deleteUser'
import { default_template } from '../src/common/template_default/template_default'
import { main } from '../src/common/createTemplate/main'
import { dettachUserPolicy } from '../src/common/createTemplate/User/DettachUserPolicy'
import { getAccessKey } from '../src/common/createTemplate/User/getAccessKey'
import { deleteAccessKey } from '../src/common/createTemplate/User/deleteAccessKey'
import { deleteRepo } from '../src/common/createTemplate/Repository/deleteRepo'
test("Testa se o Repositório está criado, caso não, terá que ser criado", async () =>{
    const temp = await default_template("unitTestJestRepo","Prod",["ecs","logs","loadbalancer"])
    await main("unitTestJestRepo","Prod",temp)
    await deleteRepo("unitTestJestRepo")
    const check = await main("unitTestJestRepo","Prod",temp) 
    expect(check.policy).toEqual("ja existe")
    expect(check.policy_version).toEqual("Policy Version é igual a Policy solicitada")
    expect(check.repo).toEqual("Repositório e arquivos criados com sucesso!")
    expect(check.user).toEqual("Usuário já existe e a policy já está atachada ao mesmo")
    await dettachUserPolicy("arn:aws:iam::132818155912:policy/Prod-deploy-unitTestJestRepo-policy","Prod-deploy-unitTestJestRepo")
    const teste = await getAccessKey("Prod-deploy-unitTestJestRepo")
    for (let i of teste){
        await deleteAccessKey(i.AccessKeyId,"Prod-deploy-unitTestJestRepo")
    }
    await deleteUser("Prod-deploy-unitTestJestRepo")
    await deletePolicy("arn:aws:iam::132818155912:policy/Prod-deploy-unitTestJestRepo-policy")
    await deleteRepo("unitTestJestRepo")
})
