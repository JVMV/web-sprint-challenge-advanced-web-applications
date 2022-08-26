// ✨ implement axiosWithAuth
import axios from 'axios'

export const axiosWithAuth = () => {
    axios.create({
        baseURL: 'http://localhost:9000/api/',
        headers: {
            Authorization: token
        }
    })
}

