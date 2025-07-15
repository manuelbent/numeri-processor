const ioc = {} as any
const logger = {} as any
const message = {} as any

;(async () => {
    logger.debug(message, 'Processing worker message')

    try {
        const trackingEvent = await ioc.trackingEventService.getById(message.meta.id)
        if (!trackingEvent) {
            logger.error(`No tracking event found with ID ${message.meta.id}`)
            return
        }

        await ioc.trackingEventService.update(trackingEvent.id, { status: 'processing' })

        const geolocation = await ioc.geolocationService.evaluate(trackingEvent.payload.$ip)

        await ioc.analyticsEventService.create({
            trackingEventId: trackingEvent.id,
            eventType: trackingEvent.payload.event,
            site: trackingEvent.payload.$site,
            geolocation,
            countryCode: geolocation?.countryCode,
            timestamp: trackingEvent.payload.timestamp,
            meta: trackingEvent.payload.properties,
        })

        await ioc.trackingEventService.update(trackingEvent.id, {
            status: 'processed',
            processedAt: new Date(),
        })
    } catch (err) {
        logger.error(err, 'Something went wrong while processing worker message')
        await ioc.trackingEventService.update(message.meta.id, {
            status: 'failed',
            errorMessage: (err as Error).message
        })
        return
    }

    logger.debug(message, 'Worker message processed successfully')
})()