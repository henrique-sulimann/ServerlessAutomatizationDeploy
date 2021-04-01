import axios from 'axios'
axios.defaults.baseURL = "https://api.github.com"
axios.defaults.headers.common['Authorization'] = "token "
axios.defaults.headers.common['Accept'] = "application/vnd.github.v3+json"
export const getRepo = async(service:string) => {
    return await axios.get("/repos/henrique-sulimann/"+service).then(function(){return "repositório encontrado"}).catch(function(){return "repositório não encontrado"})
    //console.log("Repositório encontrado, verificando se o arquivo deploy.sh está criado no mesmo")

}