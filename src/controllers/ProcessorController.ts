import { logger } from '@manuelbent/numeri-core'
import EventServiceInterface from '../interfaces/EventServiceInterface'
import GeolocationServiceInterface from '../interfaces/GeolocationServiceInterface'

/**
 * @class ProcessorController
 */
export default class ProcessorController {
    /**
     * @constructor
     * @param {EventServiceInterface} eventService
     * @param {GeolocationServiceInterface} geolocationService
     */
    constructor(
        private eventService: EventServiceInterface,
        private geolocationService: GeolocationServiceInterface,
    ) {}

    /**
     * Processes a raw event message.
     * This method is called when a message is received from the Redis channel.
     * It parses the message, retrieves the raw event by ID,
     * updates its status to 'processing',
     * evaluates the geolocation based on the IP address,
     * creates a processed event,
     * and finally updates the raw event status to 'processed'.
     * If any error occurs during the process,
     * it updates the raw event status to 'failed' with the error message.
     * @param {string} message
     * @return {Promise<void>}
     */
    async process(message: string): Promise<void> {
        let id: number
        try {
            ({ id } = JSON.parse(message))
        } catch (err) {
            logger.error(err, `Something went wrong while parsing raw event message: ${message}`)
            return
        }

        try {
            const rawEvent = await this.eventService.getRawById(id)
            if (!rawEvent) {
                logger.warn(`No raw event found with id: ${id}`)
                return
            }

            await this.eventService.updateRawById(id, { status: 'processing' })

            const geolocation = await this.geolocationService.evaluate(rawEvent.payload.$ip)

            const visitorId = this.eventService.evaluateVisitorId(rawEvent.payload)

            await this.eventService.createProcessed({
                visitorId,
                rawEventId: rawEvent.id,
                type: rawEvent.payload.event,
                geolocation,
                countryCode: geolocation?.countryCode,
                site: rawEvent.payload.$site,
                timestamp: rawEvent.payload.timestamp,
                properties: rawEvent.payload.properties,
            })

            await this.eventService.updateRawById(rawEvent.id, {
                payload: { ...rawEvent.payload, $ip: '-' }, // mask IP address after processing
                status: 'processed',
                processedAt: new Date(),
            })
        } catch (err) {
            logger.error(err, `Something went wrong while processing raw event message: ${message}`)
            await this.eventService.updateRawById(id, {
                status: 'failed',
                errorMessage: (err as Error).message
            })
            return
        }
    }
}
