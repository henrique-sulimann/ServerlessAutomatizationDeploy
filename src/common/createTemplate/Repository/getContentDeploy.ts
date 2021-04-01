import axios from 'axios'
axios.defaults.baseURL = "https://api.github.com"
axios.defaults.headers.common['Authorization'] = "token "
axios.defaults.headers.common['Accept'] = "application/vnd.github.v3+json"
export const getContentDeploy = async(service:string) => {
    return await axios({
        method: 'get',
        url: '/repos/henrique-sulimann/'+service+'/contents/deploy.sh'
    }).then(function(){return "arquivo deploy.sh encontrado"}).catch(function(){return "arquivo deploy.sh não encontrado"})

}