import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const CLIENT_ID = '1474805'
const API_URL = 'http://localhost:3001'
const localApi = {
    getToken: (code) => axios.post(`${API_URL}/token`, { code, redirectURI: window.location.href }),
    refreshToken: (token) => axios.post(`${API_URL}/token/refresh`, { token, redirectURI: window.location.href }),
    getBoards: () => {
        const headers = { 
           Authorization: localStorage.getItem('token')
        }
        return axios.get(`${API_URL}/boards`, { headers })
    },
    getBoardPins: (boardId) => {
        const headers = { 
           Authorization: localStorage.getItem('token')
        }
        return axios.get(`${API_URL}/boards/${boardId}/pins`, { headers })
    },
    getUserAccount: () => {
        const headers = { 
           Authorization: localStorage.getItem('token')
        }
        return axios.get(`${API_URL}/user`, { headers })
    },
}

const Board = ({id, name, description }) => {
    const [pins, setPins] = useState([])
    const [open, setOpen] = useState(false)
    const [intervalValue, setIntervalValue] = useState(10000)
    const [imagesValue, setImagesValue] = useState(10)
    const [checkedRandom, setCheckedRandom] = useState(false)
    
    let navigate = useNavigate();

    const handleClick = async () => {
        try {
            if (pins.length > 0) {
                setOpen(o => !open)
            }
            else {
                const { data } = await localApi.getBoardPins(id)
                setPins(data.items)
                setOpen(true)
            }
        }
        catch (e) {
            console.log(e)
            alert('Request failed!')
        }
    }

    const handleChangeValue = (e) => {
        setIntervalValue(e.target.value)
    }

    
    const handleImagesValue = (e) => {
        setImagesValue(e.target.value)
    }

    
    const handleChangeCheckedRandom = () => {
        setCheckedRandom(checked => !checked)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        navigate('/timed', { state: { pins: pins, interval: intervalValue, images: imagesValue, random: checkedRandom } })
    }


    

    return  <div>
        <h3 onClick={handleClick}>{name}</h3>
        <p>{description}</p>
        <p>
        {open && (
            <>
                <form onSubmit={handleSubmit}>
                    <label>Interval <input type="number" value={intervalValue} onChange={handleChangeValue} /></label>
                    <label>Images <input type="number" value={imagesValue} onChange={handleImagesValue} /></label>
                    <label><input type="checkbox" checked={checkedRandom} onChange={handleChangeCheckedRandom} />Random</label>
                    <button type="submit">Start</button>
                </form>
                {pins.map(pin => <img src={pin.media.images['150x150'].url} width={150} height={150} />)}
            </>
        )}
        </p>
    </div>
}

const Main = () => {
    const [boards, setBoards] = useState([])
    
    let [searchParams] = useSearchParams();
    let navigate = useNavigate();

    const handleGetToken = async () => {
        try {
            const accessToken = localStorage.getItem('token')
            const { data } = await (accessToken 
                ? localApi.refreshToken(accessToken) 
                : localApi.getToken(localStorage.getItem('code')))
            localStorage.setItem('token', data.access_token)
        }
        catch (e) {
            console.log(e)
            alert('Request failed!')
        }
    }
    const handleGetBoards = async () => {
        try {
            const { data } = await localApi.getBoards()
            setBoards(data.items)
        }
        catch (e) {
            console.log(e)
            alert('Request failed!')
        }
    }

    const handleLoginClick = () => {
        const securityHash = Date.now()
        localStorage.setItem('hash', securityHash)
        window.location.href = `https://www.pinterest.com/oauth/?client_id=${CLIENT_ID}&redirect_uri=${window.location.href}&response_type=code&scope=user_accounts:read,boards:read,pins:read&state=${securityHash}`
    }
    
    useEffect(() => {
        const securityHash = localStorage.getItem('hash')
        if (securityHash === searchParams.get('state')) {
            const code = searchParams.get('code')
            if (code) {
                localStorage.setItem('code', code)
                localStorage.removeItem('hash')
                localStorage.removeItem('token')
                navigate(`/`)
            }
        }
    }, [])

    return <div>
        <h2>Main page</h2>
        <button onClick={handleLoginClick}>Login</button>
        <button onClick={handleGetToken}>Get Token</button>
        <button onClick={handleGetBoards}>Get Boards</button>
        {boards.map(board => <Board  key={board.id} {...board} />)}
    </div>
}

export default Main