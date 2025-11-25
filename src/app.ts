import 'dotenv/config'
import { logger } from '@manuelbent/numeri-core'

import './config/redis'
import ioc from './config/ioc'
import { client as redisClient } from './config/redis'

;(async () => {
    try {
        await redisClient.subscribe('raw-events', (message) => ioc.processorController.process(message))
    } catch (err) {
        logger.error(err, 'Something went wrong while subscribing to Redis channel')
    }
})()
