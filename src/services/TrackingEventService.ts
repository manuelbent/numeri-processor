import logger from '../utils/logger'
import GeolocationServiceInterface from '../interfaces/GeolocationServiceInterface'
import AnalyticsEventServiceInterface from '../interfaces/AnalyticsEventServiceInterface'

export default class TrackingEventService {
    constructor(
        private geolocationService: GeolocationServiceInterface,
        private analyticsEventService: AnalyticsEventServiceInterface
    ) {}

    private async getById(id: string): Promise<any> {}

    private async update(id: string, data: any): Promise<void> {}

    public async process(message: string): Promise<void> {
        let id: string
        try {
            ({ id } = JSON.parse(message))
        } catch (err) {
            logger.error(err, `Could not parse message: ${message}`)
            return
        }

        try {
            const trackingEvent = await this.getById(id)
            if (!trackingEvent) {
                logger.error(`No tracking event found with ID ${id}`)
                return
            }

            await this.update(trackingEvent.id, { status: 'processing' })

            const geolocation = await this.geolocationService.evaluate(trackingEvent.payload.$ip)

            await this.analyticsEventService.create({
                trackingEventId: trackingEvent.id,
                eventType: trackingEvent.payload.event,
                site: trackingEvent.payload.$site,
                geolocation,
                countryCode: geolocation?.countryCode,
                timestamp: trackingEvent.payload.timestamp,
                meta: trackingEvent.payload.properties,
            })

            await this.update(trackingEvent.id, {
                status: 'processed',
                processedAt: new Date(),
            })
        } catch (err) {
            logger.error(err, `Something went wrong while processing tracking event message: ${message}`)
            await this.update(id, {
                status: 'failed',
                errorMessage: (err as Error).message
            })
            return
        }
    }
}
