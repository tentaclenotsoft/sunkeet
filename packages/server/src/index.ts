import express from 'express'

const app = express()

app.get('/', (resquest, response) => response.sendStatus(200))

app.listen(process.env.PORT)
