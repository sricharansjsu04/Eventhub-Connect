import axios from "axios"

const apiPath = "https://pbh79m29ck.execute-api.us-east-2.amazonaws.com/Dev/api"
export const getApi = () => {
  return  axios.get(`${apiPath}/getPlayAreas`)
    .then(res=> {
      return res
    })
    .catch(err=>console.log(err))
}

export const deleteApi = (id) => {
    return axios.delete(`${apiPath}/deletePlayArea/${id}`)
    .then(res=> console.log("deleted",res))
    .catch(err=>console.log(err))
}


export const createUpdateApi = (palyload, id='') => {
    const path = id ? 'updatePlayArea' : 'createPlayArea';
   return axios.post(`${apiPath}/${path}`, palyload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })
        .then(res =>{
            return res;
        })
        .catch(error => console.error('axiosError:', error));
}