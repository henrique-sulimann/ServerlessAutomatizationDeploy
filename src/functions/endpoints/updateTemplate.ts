import { APIGatewayProxyHandler } from 'aws-lambda'
import { updatePolicy } from '../../../src/common/updateTemplate/updatePolicy'
import { default_template } from '../../../src/common/template_default/template_default'
type requestParams = {
    service: string,
    env: string,
    recursos: any[]
}
export const handler: APIGatewayProxyHandler = async (event, _context) => {
    const requestBody: requestParams = JSON.parse(event.body)
    const {
        service,
        env,
        recursos,
    } = requestBody
    const temp = await default_template(service,env,recursos)
    const policyUpdate = await updatePolicy(service,env,temp)
    return {
        statusCode: 200,
        body: JSON.stringify({
            ServiceName: service,
            Branch: env,
            Recursos: recursos,
            Policy: policyUpdate
        })
    }
    
}
