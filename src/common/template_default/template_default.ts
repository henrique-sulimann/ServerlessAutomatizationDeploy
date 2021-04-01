import { S3 } from 'aws-sdk'
const s3 = new S3()
let c;
export const default_template = async(service:string, env: string, recursos: any[]) => {
    type Template = {
        "Version": string,
        "Statement": any[]
    } 
    const template_default: Template = {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Action": [],
                "Resource": [],
                "Effect": "Allow",
                "Sid": "VisualEditor0"
            },
            {
                "Action": [],
                "Resource": ["*"],
                "Effect": "Allow",
                "Sid": "VisualEditor1"
            }
        ]
    }
    for (let i of recursos){
        c = await s3.getObject({Bucket: "template-policy", Key:i.name+'.json'}).promise()
        let data = JSON.parse(c.Body.toString('utf-8'));
        if (i.name == "ecs"){
            let action = data.Statement
            let iam_role = [
               "arn:aws:ecs:*:132818155912:cluster/"+env,
                "arn:aws:ecs:*:132818155912:task-definition/"+service+"*:*",
                "arn:aws:ecs:*:132818155912:container-instance/*",
                "arn:aws:ecs:*:132818155912:service/"+env+"-"+service+"*",
                "arn:aws:ecs:*:132818155912:cloudformation/"+env+"-"+service+"*",
                "arn:aws:iam::132818155912:role/ecsTaskExecutionRole"
            ]
            let resource = action[0].Resource
            for (let e of iam_role){
                resource.push(e)
            }
            for (let policy in action){
                if (policy == '0'){  
                  for (let w of action[0].Action){
                      template_default.Statement[0].Action.push(w)
                  }              
                  for (let w of action[0].Resource){
                      template_default.Statement[0].Resource.push(w)
                  }   
                }else if (policy == '1'){
                  for(let w of action[1].Action){
                      template_default.Statement[1].Action.push(w)
                  }               
                }
            }         
    }
      else if (i.name == "logs"){
          let action = data.Statement
          let iam_role = [
              "arn:aws:cloudwatch:*:132818155912:alarm:"+env+"-"+service+"*",
              "arn:aws:cloudwatch:*:132818155912:insight-rule/"+env+"-"+service+"*",
              "arn:aws:cloudwatch::132818155912:dashboard/"+env+"-"+service+"*",
              "arn:aws:logs:*:132818155912:log-group:"+env+"-"+service+"*",
              "arn:aws:logs:us-east-1:132818155912:log-group:/ecs/"+env+"-"+service+"*:log-stream:*"
          ]
          let resource = action[0].Resource
          for (let e of iam_role){
              resource.push(e)
          }
          for (let policy in action){
              if (policy == '0'){
                  for (let f of action[0].Action){
                      template_default.Statement[0].Action.push(f)
                  }
                  for (let j of action[0].Resource){
                      template_default.Statement[0].Resource.push(j)
                  }
              }else if (policy == '1'){
                  for (let h of action[1].Action){
                      template_default.Statement[1].Action.push(h)
                  }
              }
          }
      }
      else if (i.name == "loadbalancer"){
          let action = data.Statement
          let iam_role = [
              "arn:aws:elasticloadbalancing:us-east-1:132818155912:targetgroup/"+env+service+"*/*",
              "arn:aws:elasticloadbalancing:us-east-1:132818155912:listener-rule/app/"+env+service+"/175453d798d3fb6b/9800c2129c3f78b9/*",
              "arn:aws:elasticloadbalancing:us-east-1:132818155912:listener-rule/app/"+env+service+"/175453d798d3fb6b/371049906a1bd000/*"
          ]
          let resource = action[0].Resource
          for (let e of iam_role){
              resource.push(e)
          }
          for (let policy in action){
              if (policy == '0'){
                  for (let f of action[0].Action){
                      template_default.Statement[0].Action.push(f)
                  }
                  for (let j of action[0].Resource){
                      template_default.Statement[0].Resource.push(j)
                  }
              }else if (policy == '1'){
                  for (let h of action[1].Action){
                      template_default.Statement[1].Action.push(h)
                  }
              }
          }
      } 
      else if (i.name == "cloudformation"){
          let action = data.Statement
          let iam_role = [
              "arn:aws:cloudformation:*:132818155912:stackset/"+env+service+"*:*",
              "arn:aws:cloudformation:*:132818155912:stack/"+env+service+"*",
              "arn:aws:cloudformation:us-east-1:132818155912:stack/"+env+service+"/*",
          ]
          let resource = action[0].Resource
          for (let e of iam_role){
              resource.push(e)
          }
          for (let policy in action){
              if (policy == '0'){
                  for (let q of action[0].Action){
                      template_default.Statement[0].Action.push(q)
                  }
                  for (let q of action[0].Resource){
                      template_default.Statement[0].Resource.push(q)
                  }
              }else if (policy == '1'){
                  for (let q of action[1].Action){
                      template_default.Statement[1].Action.push(q)
                  }
              }
          }
      } 
      else if (i.name == "ecr"){
          let action = data.Statement
          for (let policy in action){
              if (policy == '1'){
                  for (let h of action[1].Action){
                      template_default.Statement[1].Action.push(h)
                  }
              }
          }
      } 
      else if (i.name == "service_discovery"){
          let action = data.Statement
          for (let policy in action){
              if (policy == '1'){
                  for (let h of action[1].Action){
                      template_default.Statement[1].Action.push(h)
                  }
              }
          }
      } 
      else if (i.name == "auto-scaling"){
          let action = data.Statement
          for (let policy in action){
              if (policy == '1'){
                  for (let h of action[1].Action){
                      template_default.Statement[1].Action.push(h)
                  }
              }
          }
      }            
    }
    return template_default
}
/* default_template("api","prod",[{
    "name":"ecs",
    "containerPort":80,
    "hostPort":80,
    "protocol":"tcp",
    "environment": [
        {
            "Key":"service",
            "Value":"teste"
        }
    ]
},
{
    "name":"logs"
}]) */
