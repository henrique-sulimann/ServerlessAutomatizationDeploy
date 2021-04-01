import axios from 'axios'
axios.defaults.baseURL = "https://api.semaphoreci.com"
axios.defaults.headers.common['Authorization'] = "Token "

export const getProject = async() => {
    const t = await axios({
        method: 'get',
        url: '/v2/orgs/omnichat/projects'
    })//.then(function(){return "arquivo deploy.sh encontrado"}).catch(function(){return "arquivo deploy.sh não encontrado"})
    //let project = "Não OK"
    for (let i of t.data){
        console.log(i.name)
    }
    //
}
getProject()