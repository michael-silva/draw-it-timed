
const CLIENT_ID = '1474805'
const REDIRECT_URI = `${process.env.REACT_APP_REDIRECT_URL || 'http://localhost:3000'}/auth`

    const clearSession = () => {
        localStorage.removeItem('hash')
        localStorage.removeItem('token')
        window.location.reload()
      }

      const createSession = () => {
        const securityHash = Date.now()
        localStorage.setItem('hash', securityHash)
        window.location.href = `https://www.pinterest.com/oauth/?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=user_accounts:read,boards:read,boards:read_secret,pins:read,pins:read_secret&state=${securityHash}`
    }

    export default {
        clearSession,
        createSession,
    }