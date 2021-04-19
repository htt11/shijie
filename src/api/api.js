import axios from 'axios';

const ip = "127.0.0.1"
const port = 3030
export const baseUrl = `http://${ip}:${port}`;
export const ImgUrl = baseUrl + "/uploads/"

const instance = axios.create({
    baseURL:baseUrl,
    timeout:10000, //超时时间
    headers:{
        // 'Content-Type':'application/x-www-form-urlencoded'
        'Content-Type':'application/json'
    }
})

instance.interceptors.request.use( config => config ,e => Promise.reject(e))

instance.interceptors.response.use( resp => {
    if (resp.status === 200) {
        return Promise.resolve(resp)
    }else{
        return Promise.reject(resp)
    }
},e =>{
    if (e.response.status) {
        return Promise.reject(e.response)
    }
})

export const Http = (api,param)=>{
    return new Promise((resolve,reject)=>{
        instance.post("/api"+api,param)
            .then(res => {
                resolve(res.data)
            })
            .catch(e => {
                reject(e)
            })
    })
}

export const HttpGql = (param)=>{
    return new Promise((resolve,reject)=>{
        instance.post("/gql",param)
            .then(res => {
                resolve(res.data)
            })
            .catch(e => {
                reject(e)
            })
    })
}
