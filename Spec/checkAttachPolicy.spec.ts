import { deletePolicy } from '../src/common/createTemplate/Policy/deletePolicy'
import { deleteUser } from '../src/common/createTemplate/User/deleteUser'
import { default_template } from '../src/common/template_default/template_default'
import { main } from '../src/common/createTemplate/main'
import { dettachUserPolicy } from '../src/common/createTemplate/User/DettachUserPolicy'
import { getAccessKey } from '../src/common/createTemplate/User/getAccessKey'
import { deleteAccessKey } from '../src/common/createTemplate/User/deleteAccessKey'
import { deleteRepo } from '../src/common/createTemplate/Repository/deleteRepo'
test("Testa se o user está criado e a policy não está attachado, se a policy está criada e o repositório está criado", async () =>{
    const temp = await default_template("unitTestJestAttach","devel",["ecs","logs","loadbalancer"])
    await main("unitTestJestAttach","devel",temp)
    await dettachUserPolicy("arn:aws:iam::132818155912:policy/devel-deploy-unitTestJestAttach-policy","devel-deploy-unitTestJestAttach")
    const check = await main("unitTestJestAttach","devel",temp) 
    expect(check.policy).toEqual("ja existe")
    expect(check.policy_version).toEqual("Policy Version é igual a Policy solicitada")
    expect(check.repo).toEqual("Repositório e arquivo já existem")
    expect(check.user).toEqual("Usuário já existe e a policy não estava atachada, portanto, foi atachada com sucesso!")
    await dettachUserPolicy("arn:aws:iam::132818155912:policy/devel-deploy-unitTestJestAttach-policy","devel-deploy-unitTestJestAttach")
    const teste = await getAccessKey("devel-deploy-unitTestJestAttach")
    for (let i of teste){
        await deleteAccessKey(i.AccessKeyId,"devel-deploy-unitTestJestAttach")
    }
    await deleteUser("devel-deploy-unitTestJestAttach")
    await deletePolicy("arn:aws:iam::132818155912:policy/devel-deploy-unitTestJestAttach-policy")
    await deleteRepo("unitTestJestAttach")
})
