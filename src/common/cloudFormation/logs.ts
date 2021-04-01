import * as YAML from 'js-yaml'
import * as camelcase from 'camelcase'
import { S3 } from 'aws-sdk'
const s3 = new S3()

export const logsCloudFormation = async(service:string) => {
            let c = await s3.getObject({Bucket: "cf-templateapi", Key:'logs.yaml'}).promise()
            let data = c.Body.toString('utf-8')
            let logscf = YAML.load(data)
            // ####### LogsGroups ##########
            logscf.CloudWatchLogsGroup.Properties.LogGroupName['Fn::Sub'] = [
                '/ecs/${prefixLog}-'+service+'-cf',
                { prefixLog: { 'Fn::Ref': 'Env' } }
              ]
            // ####### FailureMetric ##########
            for(let metric of logscf.FailureMetric.Properties.MetricTransformations){
              metric.MetricNamespace = { 'Fn::Sub': '${Env}-'+service }
            }
            // ####### ErrorMetric ##########
            logscf.ErrorAlarm.Properties.AlarmDescription = camelcase(service,{pascalCase: true})+" Error Increasing"
            logscf.ErrorAlarm.Properties.AlarmName = { 'Fn::Sub': "${Env}-"+camelcase(service,{pascalCase: true})+"ErrorIncreasing" }
            logscf.ErrorAlarm.Properties.Namespace = { 'Fn::Sub': "${Env}-"+service }
            // ####### CPUMetric ##########
            logscf.CPUAlarm.Properties.AlarmDescription = camelcase(service,{pascalCase: true})+" CPU High"
            logscf.CPUAlarm.Properties.AlarmName = { 'Fn::Sub': "${Env}-"+camelcase(service,{pascalCase: true})+"CPUHigh" }
            for (let e of logscf.CPUAlarm.Properties.Dimensions){
                if (e.Name == "ServiceName"){
                    e.Value = service+"-cf"
                }
            }
            // ####### MemoryAlarm ##########
            logscf.MemoryAlarm.Properties.AlarmDescription = camelcase(service,{pascalCase: true})+" Memory High"
            logscf.MemoryAlarm.Properties.AlarmName = { 'Fn::Sub': "${Env}-"+camelcase(service,{pascalCase: true})+"MemoryHigh" }
            for (let e of logscf.MemoryAlarm.Properties.Dimensions){
                if (e.Name == "ServiceName"){
                    e.Value = service+"-cf"
                }
            }
            return logscf
}
//logsCloudFormation("teste")

