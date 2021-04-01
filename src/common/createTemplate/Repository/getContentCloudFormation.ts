import axios from 'axios'
axios.defaults.baseURL = "https://api.github.com"
axios.defaults.headers.common['Authorization'] = "token "
axios.defaults.headers.common['Accept'] = "application/vnd.github.v3+json"
export const getContentCloudFormation = async(service:string) => {
    return await axios({
        method: 'get',
        url: '/repos/henrique-sulimann/'+service+'/contents/cloud-formation.yaml'
    }).then(function(){return "arquivo cloud-formation.yaml encontrado"}).catch(function(){return "arquivo cloud-formation.yaml não encontrado"})

}