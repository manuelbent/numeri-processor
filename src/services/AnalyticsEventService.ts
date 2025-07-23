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
}
