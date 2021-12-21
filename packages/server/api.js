const axios = require('axios')
const express = require('express')

const CLIENT_ID = process.env.PINTERST_CLIENT_ID
const CLIENT_SECRET = process.env.PINTERST_CLIENT_SECRET

const toB64 = (str) => {
    return Buffer.from(str).toString('base64')
}

const pinterestApi = {
    getToken: (code) => {
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${toB64(`${CLIENT_ID}:${CLIENT_SECRET}`)}`
        }
        const body = {
            code,
            grant_type:'authorization_code',
            redirect_uri: 'http://localhost:3000/',
            
        }
        return axios.post('https://api.pinterest.com/v5/oauth/token', new URLSearchParams(body), { headers })

    },
    refreshToken: (token) => {
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${toB64(`${CLIENT_ID}:${CLIENT_SECRET}`)}`
        }
        const body = {
            refresh_token: token,
            grant_type:'refresh_token',
            redirect_uri: 'http://localhost:3000/',
            
        }
        return axios.post('https://api.pinterest.com/v5/oauth/token', new URLSearchParams(body), { headers })

    },
    getUserAccount: () => {
        return axios.get('https://api.pinterest.com/v5/user_account')
    },
    getBoards: () => {
        return axios.get('https://api.pinterest.com/v5/boards')
    },
    getBoardPins: (boardId) => {
        return axios.get(`https://api.pinterest.com/v5/boards/${boardId}/pins`)
    },
}

const router = express.Router()

router.use((req, res, next) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${req.headers.authorization}`;
    next()
})

router.get('/', (req, res) => {
    res.send('Hello World!')
})

router.post('/token', async (req, res) => {
    try {
        console.log(req.body)
        const { code } = req.body
        const { data } = await pinterestApi.getToken(code)
        res.json(data)
    }
    catch (e) {
        const status = e.response ? e.response.status : 500
        const data = e.response ? e.response.data : {}
        res.status(status).send(data)
    }
})

router.post('/token/refresh', async (req, res) => {
    try {
        const { token } = req.post
        const { data } = await pinterestApi.refreshToken(token)
        res.json(data)
    }
    catch (e) {
        const status = e.response ? e.response.status : 500
        const data = e.response ? e.response.data : {}
        res.status(status).send(data)
    }
})


router.get('/user', async (req, res) => {
    try {
        const { data } = await pinterestApi.getUserAccount()
        res.json(data)
    }
    catch (e) {
        const status = e.response ? e.response.status : 500
        const data = e.response ? e.response.data : {}
        res.status(status).send(data)
    }
})


router.get('/boards', async (req, res) => {
    try {
        const { data } = await pinterestApi.getBoards()
        res.json(data)
    }
    catch (e) {
        const status = e.response ? e.response.status : 500
        const data = e.response ? e.response.data : {}
        res.status(status).send(data)
    }
})


router.get('/boards/:boardId/pins', async (req, res) => {
    try {
        const { data } = await pinterestApi.getBoardPins(req.params.boardId)
        res.json(data)
    }
    catch (e) {
        const status = e.response ? e.response.status : 500
        const data = e.response ? e.response.data : {}
        res.status(status).send(data)
    }
})

module.exports = router