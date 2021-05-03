import amqp from "amqplib"
import { config } from './config'

export const consumeFromQueue = async (queue, isNoAck = false, prefetch = null) => {
  const cluster = await amqp.connect(config.rabbit.connectionString)
  const channel = await cluster.createChannel()

  await channel.assertQueue(queue)

  if (prefetch) {
    channel.prefetch(prefetch)
  }

  console.log(`Waiting for get messages from ${queue}.`)

  try {
    channel.consume(queue, message => {
      if (message !== null) {
        console.log('Received', JSON.parse(message.content.toString()))
        channel.ack(message)
        return null
      } else {
        console.log('Queue is empty!')
        channel.reject(message)
      }
    }, { noAck: isNoAck })
  } catch (error) {
    console.log(error, 'Failed to consume messages from Queue!')
    cluster.close()
  }
}


