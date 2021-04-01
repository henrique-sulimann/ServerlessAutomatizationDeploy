import axios from 'axios'
axios.defaults.baseURL = "https://api.github.com"
axios.defaults.headers.common['Authorization'] = "token "
axios.defaults.headers.common['Accept'] = "application/vnd.github.v3+json"
export const putContentCloudFormation = async(service:string,cloudformation:string) => {
    console.log("teste: "+cloudformation)
    return await axios({
        method: 'put',
        url: '/repos/henrique-sulimann/'+service+'/contents/cloud-formation.yaml',
        data: {
            message: "message1",
            content: Buffer.from(cloudformation).toString("base64")
        }
    })

}