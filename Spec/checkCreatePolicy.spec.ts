import { deletePolicy } from '../src/common/createTemplate/Policy/deletePolicy'
import { deleteUser } from '../src/common/createTemplate/User/deleteUser'
import { default_template } from '../src/common/template_default/template_default'
import { main } from '../src/common/createTemplate/main'
import { dettachUserPolicy } from '../src/common/createTemplate/User/DettachUserPolicy'
import { getAccessKey } from '../src/common/createTemplate/User/getAccessKey'
import { deleteAccessKey } from '../src/common/createTemplate/User/deleteAccessKey'
import { deleteRepo } from '../src/common/createTemplate/Repository/deleteRepo'
test("Testa se a verificação da policy está correta e irá dizer que a policy não existe e a mesma não está attachada ao usuário", async () =>{
    const temp = await default_template("unitTestJestPolicy","prod",["ecs","logs","loadbalancer"])
    await main("unitTestJestPolicy","prod",temp)
    await dettachUserPolicy("arn:aws:iam::132818155912:policy/prod-deploy-unitTestJestPolicy-policy","prod-deploy-unitTestJestPolicy")
    await deletePolicy("arn:aws:iam::132818155912:policy/prod-deploy-unitTestJestPolicy-policy")
    const check = await main("unitTestJestPolicy","prod",temp) 
    expect(check.policy).toEqual("não existe e foi criada com sucesso")
    expect(check.repo).toEqual("Repositório e arquivo já existem")
    expect(check.user).toEqual("Usuário já existe e a policy não estava atachada, portanto, foi atachada com sucesso!")
    await dettachUserPolicy("arn:aws:iam::132818155912:policy/prod-deploy-unitTestJestPolicy-policy","prod-deploy-unitTestJestPolicy")
    const teste = await getAccessKey("prod-deploy-unitTestJestPolicy")
    for (let i of teste){
        await deleteAccessKey(i.AccessKeyId,"prod-deploy-unitTestJestPolicy")
    }
    await deleteUser("prod-deploy-unitTestJestPolicy")
    await deletePolicy("arn:aws:iam::132818155912:policy/prod-deploy-unitTestJestPolicy-policy")
    await deleteRepo("unitTestJestPolicy")
})
