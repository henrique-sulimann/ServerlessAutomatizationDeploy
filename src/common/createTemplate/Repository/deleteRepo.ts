import axios from 'axios'
axios.defaults.baseURL = "https://api.github.com"
axios.defaults.headers.common['Authorization'] = "token "
axios.defaults.headers.common['Accept'] = "application/vnd.github.v3+json"
export const deleteRepo = async(service:string) => {
    return await axios({
        method: 'delete',
        url: '/repos/henrique-sulimann/'+service
    }).catch(function(){return "falha na deleção do repositório"}) 

}