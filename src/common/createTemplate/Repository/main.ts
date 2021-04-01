import axios from 'axios'
import { getContentDeploy} from './getContentDeploy'
import { getRepo} from './getRepo'
import { postRepo } from './postRepo'
import { putContentDeploy } from './putContentDeploy'
import { getContentCloudFormation } from './getContentCloudFormation'
import { putContentCloudFormation } from './putContentCloudFormation'
axios.defaults.baseURL = "https://api.github.com"
axios.defaults.headers.common['Authorization'] = "token 50d3009cb7be6b81fa96d97fed3089a943045e09"
axios.defaults.headers.common['Accept'] = "application/vnd.github.v3+json"
export const check_repo = async(service:string,cloudformation:string) => {
    try {
        const repoGet = await getRepo(service)
        if (repoGet == "repositório encontrado"){
            const contentCloudFormationGet = await getContentCloudFormation(service)
            const contentDeployGet = await getContentDeploy(service)
            if(contentDeployGet == "arquivo deploy.sh encontrado"){
                if (contentCloudFormationGet == "arquivo cloud-formation.yaml encontrado"){
                    return "Repositório, deploy.sh e cloud-formatino.yaml já existem"
                }else{
                    await putContentCloudFormation(service,cloudformation)
                    return "Repositório e deploy.sh criados e o arquivo cloudformation não estava criado e foi criado com sucesso!"
                }
            }else if (contentDeployGet == "arquivo deploy.sh não encontrado" && contentCloudFormationGet == "arquivo cloud-formation.yaml encontrado"){
                await putContentDeploy(service)
                return "Repositório e cloud-formation.yaml estava criado e o arquivo deploy.sh não estavam criado e foi criado com sucesso!"
            }else{
                await putContentDeploy(service)
                await putContentCloudFormation(service,cloudformation)
                return "Repositório estava criado e os arquivos deploy.sh e cloud-formation.yaml não estavam criados e foram criados com sucesso!"
            }
        }else{
            await postRepo(service)
            await putContentDeploy(service)
            await putContentCloudFormation(service,cloudformation)
            return "Repositório, arquivo deploy.sh e cloud-formation foram criados com sucesso!"
        }
    } catch (error) {
        console.log(error)
        return "erro"
    }
}