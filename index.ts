import express from 'express'
import { config } from './rabbitmq/config'
import { publishToQueue } from './rabbitmq/producer'
import { consumeFromQueue } from './rabbitmq/consumer'

const app = express()
const port = 3000

publishToQueue(config.rabbit.queue, JSON.stringify({data: "mintja..."}))
consumeFromQueue(config.rabbit.queue)

app.listen(port, () => {       
    console.log( `server started at http://localhost:${port}`)
})