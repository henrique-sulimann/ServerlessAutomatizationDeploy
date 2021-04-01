import axios from 'axios'
axios.defaults.baseURL = "https://api.github.com"
axios.defaults.headers.common['Authorization'] = "token "
axios.defaults.headers.common['Accept'] = "application/vnd.github.v3+json"
export const postRepo = async(service:string) => {
    return await axios({
        method: 'post',
        url: '/user/repos',
        data: {
            name: service
        }
    }).then(function(){return "repo criado com sucesso"}).catch(function(err){
        console.log(err)
        return "erro ao criar o repositório"
    })
}