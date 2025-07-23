import { AnalyticsEvent, RepositoryInterface } from 'numeri-core'
import AnalyticsEventServiceInterface from '../interfaces/AnalyticsEventServiceInterface'

/**
 * @class AnalyticsEventService
 */
export default class AnalyticsEventService implements AnalyticsEventServiceInterface {
    /**
     * @constructor
     * @param {RepositoryInterface<AnalyticsEvent>} repository
     */
    constructor(private repository: RepositoryInterface<AnalyticsEvent>) {}

    /**
     * @param {object} data
     * @return {Promise<AnalyticsEvent>}
     */
    public create(data: object): Promise<AnalyticsEvent> {
        return this.repository.create(data)
    }
}
