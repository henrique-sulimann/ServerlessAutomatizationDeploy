import { deletePolicy } from '../src/common/createTemplate/Policy/deletePolicy'
import { deleteUser } from '../src/common/createTemplate/User/deleteUser'
import { default_template } from '../src/common/template_default/template_default'
import { main } from '../src/common/createTemplate/main'
import { dettachUserPolicy } from '../src/common/createTemplate/User/DettachUserPolicy'
import { getAccessKey } from '../src/common/createTemplate/User/getAccessKey'
import { deleteAccessKey } from '../src/common/createTemplate/User/deleteAccessKey'
import { deleteRepo } from '../src/common/createTemplate/Repository/deleteRepo'
test("Testa se o user está criado e a policy está attachada, se a policy está criada e se o repositório está criado", async () =>{
    const temp = await default_template("unitTestJestCreate","prod",["ecs","logs","loadbalancer"])
    await main("unitTestJestCreate","prod",temp)
    const check = await main("unitTestJestCreate","prod",temp) 
    expect(check.policy).toEqual("ja existe")
    expect(check.repo).toEqual("Repositório e arquivo já existem")
    expect(check.user).toEqual("Usuário já existe e a policy já está atachada ao mesmo")
    await dettachUserPolicy("arn:aws:iam::132818155912:policy/prod-deploy-unitTestJestCreate-policy","prod-deploy-unitTestJestCreate")
    const teste = await getAccessKey("prod-deploy-unitTestJestCreate")
    for (let i of teste){
        await deleteAccessKey(i.AccessKeyId,"prod-deploy-unitTestJestCreate")
    }
    await deleteUser("prod-deploy-unitTestJestCreate")
    await deletePolicy("arn:aws:iam::132818155912:policy/prod-deploy-unitTestJestCreate-policy")
    await deleteRepo("unitTestJestCreate")
})
