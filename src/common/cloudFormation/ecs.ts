import * as YAML from 'js-yaml'
import { S3 } from 'aws-sdk'
const s3 = new S3()

export const ecsCloudFormation = async(service:string,containerPort: number, hostPort: number,protocol:string,environment:any[]) => {
    let c = await s3.getObject({Bucket: "cf-templateapi", Key:'ecs.yaml'}).promise()
    let data = c.Body.toString('utf-8')
    let ecscf = YAML.load(data)
    // ####### TASK ##########
    ecscf.Task.Properties.Family = { "Fn::Sub": "${Env}-"+service+"-cf"}
    for (let h of ecscf.Task.Properties.ContainerDefinitions){
        h.Name = service
        h.LogConfiguration.Options["awslogs-group"] = { 'Fn::Sub': '/ecs/${Env}-'+service+"-cf"}
        for(let e of h.PortMappings){
            e.ContainerPort = containerPort
            e.HostPort = hostPort
            e.Protocol = protocol
        }
        for (let env of environment){
            h["Environment"] = env
        }
    }
    // ####### SERVICE ##########
    ecscf.Service.Properties.ServiceName = service+"-cf"
    for(let f of ecscf.Service.Properties.LoadBalancers){
        f.ContainerName = service+"-cf"
        f.ContainerPort = containerPort
    }
    for (let t of ecscf.Service.Properties.Tags){
        t.Value = service
    }
    return ecscf
}
/* ecsCloudFormation([{
    name:"ecs",
    service:"cloudformation-api",
    containerPort:80,
    hostPort:80,
    protocol:"tcp",
    environment:[{Name:"PORT",Value:80},{Name:"SLACK_USERNAME",Value:"cloudformation-api"},{Name:"MOIP_URL",Value:'https://teste.com.br'}],
    taskTags: [{Name: "service",Value:"cloudformation-api"}]
}],"teste-api") */

