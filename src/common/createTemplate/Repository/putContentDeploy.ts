import axios from 'axios'
axios.defaults.baseURL = "https://api.github.com"
axios.defaults.headers.common['Authorization'] = "token "
axios.defaults.headers.common['Accept'] = "application/vnd.github.v3+json"
export const putContentDeploy = async(service:string) => {
    const deploy_sh = `VERSION=$(npm run version --silent)
VERSION_SUFFIX=
STACK_PREFIX=devel
STACK_NAME=`+service+`
if [ "$BRANCH_NAME" = "devel" ]; then VERSION_SUFFIX=_devel ; fi
if [ "$BRANCH_NAME" = "master" ]; then STACK_PREFIX=prod ; fi
if [ "$BRANCH_NAME" = "devel" ]; then 
export AWS_ACCESS_KEY_ID=$DEVEL_AWS_ACCESS_KEY_ID
export AWS_SECRET_ACCESS_KEY=$DEVEL_AWS_SECRET_ACCESS_KEY 
export AWS_DEFAULT_REGION=us-east-1
else  
export AWS_ACCESS_KEY_ID=$PROD_AWS_ACCESS_KEY_ID
export AWS_SECRET_ACCESS_KEY=$PROD_AWS_SECRET_ACCESS_KEY 
export AWS_DEFAULT_REGION=us-east-1
fi
if ! aws cloudformation wait stack-exists --stack-name $STACK_PREFIX-$STACK_NAME > /dev/null 2>&1 ; then
  aws cloudformation create-stack --stack-name $STACK_PREFIX-$STACK_NAME --template-body file://./cloud-formation.yml   --parameters ParameterKey=Env,ParameterValue=$STACK_PREFIX   ParameterKey=ImageVersion,ParameterValue=$VERSION$VERSION_SUFFIX
  aws cloudformation wait stack-create-complete --stack-name $STACK_PREFIX-$STACK_NAME
else
  aws cloudformation deploy --stack-name $STACK_PREFIX-$STACK_NAME --template-file ./cloud-formation.yml   --parameter-overrides Env=$STACK_PREFIX   ImageVersion=$VERSION$VERSION_SUFFIX
  aws cloudformation describe-stack-events --stack-name $STACK_PREFIX-$STACK_NAME
fi`
    return await axios({
        method: 'put',
        url: '/repos/henrique-sulimann/'+service+'/contents/deploy.sh',
        data: {
            message: "message",
            content: Buffer.from(deploy_sh).toString("base64")
        }
    })

}