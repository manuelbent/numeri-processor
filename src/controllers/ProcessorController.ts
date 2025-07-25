import { logger } from 'numeri-core'
import TrackingEventServiceInterface from '../interfaces/TrackingEventServiceInterface'
import GeolocationServiceInterface from '../interfaces/GeolocationServiceInterface'
import AnalyticsEventServiceInterface from '../interfaces/AnalyticsEventServiceInterface'

/**
 * @class ProcessorController
 */
export default class ProcessorController {
    /**
     * @constructor
     * @param {TrackingEventServiceInterface} trackingEventService
     * @param {GeolocationServiceInterface} geolocationService
     * @param {AnalyticsEventServiceInterface} analyticsEventService
     */
    constructor(
        private trackingEventService: TrackingEventServiceInterface,
        private geolocationService: GeolocationServiceInterface,
        private analyticsEventService: AnalyticsEventServiceInterface
    ) {}

    /**
     * Processes a tracking event message.
     * This method is called when a message is received from the Redis channel.
     * It parses the message, retrieves the tracking event by ID,
     * updates its status to 'processing',
     * evaluates the geolocation based on the IP address,
     * creates an analytics event,
     * and finally updates the tracking event status to 'processed'.
     * If any error occurs during the process,
     * it updates the tracking event status to 'failed' with the error message.
     * @param {string} message
     * @return {Promise<void>}
     */
    async process(message: string): Promise<void> {
        let id: number
        try {
            ({ id } = JSON.parse(message))
        } catch (err) {
            logger.error(err, `Something went wrong while parsing tracking event message: ${message}`)
            return
        }

        try {
            const trackingEvent = await this.trackingEventService.getById(id)
            if (!trackingEvent) {
                logger.warn(`No tracking event found with id: ${id}`)
                return
            }

            await this.trackingEventService.update(id, { status: 'processing' })

            const geolocation = await this.geolocationService.evaluate(trackingEvent.payload.$ip)

            const analyticsEvent = await this.analyticsEventService.create({
                trackingEventId: trackingEvent.id,
                eventType: trackingEvent.payload.event,
                geolocation,
                countryCode: geolocation?.countryCode,
                site: trackingEvent.payload.$site,
                timestamp: trackingEvent.payload.timestamp,
                properties: trackingEvent.payload.properties,
            })
            logger.debug(`Analytics event with id ${analyticsEvent.id} created for tracking event with id ${trackingEvent.id}`)

            await this.trackingEventService.update(trackingEvent.id, {
                status: 'processed',
                processedAt: new Date(),
            })
        } catch (err) {
            logger.error(err, `Something went wrong while processing tracking event message: ${message}`)
            await this.trackingEventService.update(id, {
                status: 'failed',
                errorMessage: (err as Error).message
            })
            return
        }
    }
}