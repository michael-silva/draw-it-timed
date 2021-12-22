import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import localApi from '../../utils/api'

const Main = () => {    
    let [searchParams] = useSearchParams();
    let navigate = useNavigate();

    const handleGetToken = async () => {
        try {
            const accessToken = localStorage.getItem('token')
            const { data } = await (accessToken 
                ? localApi.refreshToken(accessToken) 
                : localApi.getToken(localStorage.getItem('code')))
            localStorage.setItem('token', data.access_token)
            navigate(`/`)
        }
        catch (e) {
            console.log(e)
            alert('Request failed!')
        }
    }
    
    useEffect(() => {
        const securityHash = localStorage.getItem('hash')
        if (securityHash === searchParams.get('state')) {
            const code = searchParams.get('code')
            if (code) {
                localStorage.setItem('code', code)
                localStorage.removeItem('hash')
                localStorage.removeItem('token')
                handleGetToken()
            }
        }
        else {
            navigate(`/`)
        }
    }, [])

    return null
}

export default Main