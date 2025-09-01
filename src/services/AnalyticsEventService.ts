import crypto from 'crypto'
import { AnalyticsEvent, AnalyticsEventRepositoryInterface } from 'numeri-core'
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
     * If the payload contains a visitorId, it returns that.
     * If not, it checks for an IP address ($ip) and generates a SHA-256 hash of it.
     * If neither is present, it returns 'anonymous'.
     * @param {object} payload
     * @return {string}
     */
    public evaluateVisitorId(payload: Record<string, any>): string {
        if (payload.visitorId) {
            return payload.visitorId
        }

        if (payload.$ip) {
            return crypto.createHash('sha256').update(payload.$ip).digest('hex')
        }

        return 'anonymous'
    }
}
