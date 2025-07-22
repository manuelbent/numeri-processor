import 'dotenv/config'
import { logger } from 'numeri-core'

import './config/redis'
import ioc from './config/ioc'
import { client as RedisClient } from './config/redis'

;(async () => {
    try {
        await RedisClient.subscribe('tracking-events', ioc.trackingEventService.process)
    } catch (err) {
        logger.error(err, 'Something went wrong while subscribing to Redis channel')
    }
})()
