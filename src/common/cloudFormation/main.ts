import { S3 } from 'aws-sdk'
import * as YAML from 'js-yaml'
import * as yml from 'yaml'
import * as camelcase from 'camelcase'
import { ecsCloudFormation } from './ecs'
import { logsCloudFormation } from './logs'

const s3 = new S3()

export const mainCloudformation = async(recursos:any[], service:string) => {
    const doc = new yml.Document();
    let c = await s3.getObject({Bucket: "cf-templateapi", Key:'cfDefault.yaml'}).promise()
    let data = c.Body.toString('utf-8')
    let cf_default = YAML.load(data)
    cf_default.Resources = {}
    cf_default.Description = camelcase(service,{pascalCase: true})
    //console.log(cf_default)
    for (let i of recursos){
        if(i.name == "ecs"){
            const ecs = await ecsCloudFormation(service,i.containerPort,i.hostPort,i.protocol,i.environment)
            for (let e in ecs){
                cf_default.Resources[e] = ecs[e]
            }
        }
        else if (i.name == "logs"){
            const logs = await logsCloudFormation(service)
            for (let l in logs){
                cf_default.Resources[l] = logs[l]
            }
        }
    }
    doc.contents = cf_default
    return doc.toString()
}
