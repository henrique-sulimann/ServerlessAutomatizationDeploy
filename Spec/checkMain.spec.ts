import { deletePolicy } from '../src/common/createTemplate/Policy/deletePolicy'
import { deleteUser } from '../src/common/createTemplate/User/deleteUser'
import { default_template } from '../src/common/template_default/template_default'
import { main } from '../src/common/createTemplate/main'
import { dettachUserPolicy } from '../src/common/createTemplate/User/DettachUserPolicy'
import { getAccessKey } from '../src/common/createTemplate/User/getAccessKey'
import { deleteAccessKey } from '../src/common/createTemplate/User/deleteAccessKey'
import { deleteRepo } from '../src/common/createTemplate/Repository/deleteRepo'
test("Testa criação completa", async () =>{
    const temp = await default_template("unitTestJest","Prod",["ecs","logs","loadbalancer"])
    const check = await main("unitTestJest","Prod",temp) 
    expect(check.policy).toEqual("não existe e foi criada com sucesso")
    expect(check.repo).toEqual("Repositório e arquivos criados com sucesso!")
    expect(check.user).toEqual("Usuário não existe e foi criado com sucesso, Access key criada com sucesso e Policy atachada com sucesso!")
    await dettachUserPolicy("arn:aws:iam::132818155912:policy/Prod-deploy-unitTestJest-policy","Prod-deploy-unitTestJest")
    const teste = await getAccessKey("Prod-deploy-unitTestJest")
    for (let i of teste){
        await deleteAccessKey(i.AccessKeyId,"Prod-deploy-unitTestJest")
    }
    await deleteUser("Prod-deploy-unitTestJest")
    await deletePolicy("arn:aws:iam::132818155912:policy/Prod-deploy-unitTestJest-policy")
    await deleteRepo("unitTestJest")
})
