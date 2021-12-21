const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const api = require('./api')

const app = express()
const port = process.env.PORT || 3001

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/', api)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})