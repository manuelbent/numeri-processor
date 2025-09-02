import { AnalyticsEvent, AnalyticsEventRepositoryInterface, Payload } from 'numeri-core'
import AnalyticsEventServiceInterface from '../interfaces/AnalyticsEventServiceInterface'

/**
 * @class AnalyticsEventService
 */
export default class AnalyticsEventService implements AnalyticsEventServiceInterface {
    /**
     * @constructor
     * @param {AnalyticsEventRepositoryInterface} repository
     */
    constructor(private repository: AnalyticsEventRepositoryInterface) {}

    /**
     * @param {object} data
     * @return {Promise<AnalyticsEvent>}
     */
    public create(data: object): Promise<AnalyticsEvent> {
        return this.repository.create(data)
    }

    /**
     * @description Evaluates the visitor ID from the payload.
     * @param {object} payload
     * @return {string}
     */
    public evaluateVisitorId(payload: Payload): string {
        if (payload.properties.visitorId) {
            return payload.properties.visitorId
        }

        return payload.$visitorId
    }
}
