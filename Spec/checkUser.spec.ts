import { deletePolicy } from '../src/common/createTemplate/Policy/deletePolicy'
import { deleteUser } from '../src/common/createTemplate/User/deleteUser'
import { default_template } from '../src/common/template_default/template_default'
import { main } from '../src/common/createTemplate/main'
import { dettachUserPolicy } from '../src/common/createTemplate/User/DettachUserPolicy'
import { getAccessKey } from '../src/common/createTemplate/User/getAccessKey'
import { deleteAccessKey } from '../src/common/createTemplate/User/deleteAccessKey'
import { deleteRepo } from '../src/common/createTemplate/Repository/deleteRepo'
import { mainCloudformation } from '../src/common/cloudFormation/main'
test("Testa se o user está criado e a policy está attachada, se a policy está criada e se o repositório está criado", async () =>{
    const temp = await default_template("unitTestJestUser","prod",[
        {
            name:"ecs",
            containerPort: 80,
            hostPort: 80,
            protocol: "tcp",
            environment: [
                {
                    Key: "service",
                    Value: "teste"
                }
            ]
        },
        {
            name:"logs"
        }
    ])
    const cloudformation = await mainCloudformation([
        {
            name:"ecs",
            containerPort: 80,
            hostPort: 80,
            protocol: "tcp",
            environment: [
                {
                    Key: "service",
                    Value: "teste"
                }
            ]
        },
        {
            name:"logs"
        }
    ],"unitTestJestUser")
    await main("unitTestJestUser","prod",temp,cloudformation)
    await dettachUserPolicy("arn:aws:iam::132818155912:policy/prod-deploy-unitTestJestUser-policy","prod-deploy-unitTestJestUser")
    const delete_access_key = await getAccessKey("prod-deploy-unitTestJestUser")
    for (let i of delete_access_key){
        await deleteAccessKey(i.AccessKeyId,"prod-deploy-unitTestJestUser")
    }
    await deleteUser("prod-deploy-unitTestJestUser")
    const check = await main("unitTestJestUser","prod",temp,cloudformation) 
    expect(check.policy).toEqual("ja existe")
    expect(check.policy_version).toEqual("Policy Version é igual a Policy solicitada")
    expect(check.repo).toEqual("Repositório e arquivo já existem")
    expect(check.user).toEqual("Usuário não existe e foi criado com sucesso, Access key criada com sucesso e Policy atachada com sucesso!")
    await dettachUserPolicy("arn:aws:iam::132818155912:policy/prod-deploy-unitTestJestUser-policy","prod-deploy-unitTestJestUser")
    const teste = await getAccessKey("prod-deploy-unitTestJestUser")
    for (let i of teste){
        await deleteAccessKey(i.AccessKeyId,"prod-deploy-unitTestJestUser")
    }
    await deleteUser("prod-deploy-unitTestJestUser")
    await deletePolicy("arn:aws:iam::132818155912:policy/prod-deploy-unitTestJestUser-policy")
    await deleteRepo("unitTestJestUser")
})
