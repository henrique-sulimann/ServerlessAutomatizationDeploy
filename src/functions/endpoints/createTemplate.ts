import { APIGatewayProxyHandler } from 'aws-lambda'
import { DynamoDB } from 'aws-sdk'
import { main } from '../../common/createTemplate/main'
import * as uuid from 'uuid'
import { default_template } from '../../../src/common/template_default/template_default'
import { mainCloudformation } from '../../../src/common/cloudFormation/main'
import 'source-map-support/register'
type requestParams = {
    service: string,
    env: string,
    recursos: any[]
}
const dynamodb = new DynamoDB.DocumentClient()
const getErrorResponse = (errorMessage: string) => {
    return {
        statusCode: 500,
        body: JSON.stringify({
            message: errorMessage,
        }),
    };
}
export const handler: APIGatewayProxyHandler = async (event, _context) => {
    const requestBody: requestParams = JSON.parse(event.body)
    const {
        service,
        env,
        recursos,
    } = requestBody
    const temp = await default_template(service,env,recursos)
    const cloudformation = await mainCloudformation(recursos,service)
    console.log(cloudformation)
    console.log("verificando se a policy já existe")
    const check = await main(service,env,temp,cloudformation)
    if (check.policy == "não existe e foi criada com sucesso" && check.repo == "Repositório e arquivos criados com sucesso!" && check.user == "Usuário não existe e foi criado com sucesso, Access key criada com sucesso e Policy atachada com sucesso!"){
        try {
            const params = {
                    TableName: process.env.DYNAMODB_TABLE,
                    Item: {
                        id: uuid.v1(),
                        userName: env+'-deploy-'+service,
                        policyName: env+'-deploy-'+service+'-policy',
                        recursos,
                        policy: temp,
                        repositorio: service
                    }
                }
                console.log(`Service: ${service}, Env: ${env}, Recursos: ${recursos}, Policy: ${temp}`)
                await dynamodb.put(params).promise();
                return {
                    statusCode: 200,
                    body: "Policy criada com sucesso, Usuário criado com sucesso e Policy attachada ao usuário com sucesso!\n"+JSON.stringify(params.Item)
                }
            } catch (error) {
                console.error(error)
                return getErrorResponse(error)
            }
    }else{
        return {
            statusCode: 200,
            body: JSON.stringify({
                policy:check.policy,
                policy_version: check.policy_version,
                usuario:check.user,
                repositorio: check.repo
            })
        }
    }
}