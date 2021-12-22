import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001'
const REDIRECT_URI = `${process.env.REACT_APP_REDIRECT_URL || 'http://localhost:3000'}/auth`
const localApi = {
    getToken: (code) => axios.post(`${API_URL}/token`, { code, redirectURI: REDIRECT_URI }),
    refreshToken: (token) => axios.post(`${API_URL}/token/refresh`, { token, redirectURI: REDIRECT_URI }),
    getBoards: () => {
        const headers = { 
           Authorization: localStorage.getItem('token')
        }
        return axios.get(`${API_URL}/boards`, { headers })
    },
    getBoardPins: (boardId, params) => {
        const headers = { 
           Authorization: localStorage.getItem('token')
        }
        return axios.get(`${API_URL}/boards/${boardId}/pins`, { headers, params })
    },
    getUserAccount: () => {
        const headers = { 
           Authorization: localStorage.getItem('token')
        }
        return axios.get(`${API_URL}/user`, { headers })
    },
}

export default localApi