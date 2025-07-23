import { TrackingEvent, RepositoryInterface } from 'numeri-core'
import TrackingEventServiceInterface from '../interfaces/TrackingEventServiceInterface'

/**
 * @class TrackingEventService
 */
export default class TrackingEventService implements TrackingEventServiceInterface {
    /**
     * @constructor
     * @param {RepositoryInterface<TrackingEvent>} repository
     */
    constructor(private repository: RepositoryInterface<TrackingEvent>) {}

    /**
     * @param {number} id
     * @return {Promise<TrackingEvent|null>}
     * @private
     */
    async getById(id: number): Promise<TrackingEvent|null> {
        return this.repository.findById(id)
    }

    /**
     * @param {number} id
     * @param {object} data
     * @returns {Promise<void>}
     * @private
     */
    async update(id: number, data: object): Promise<void> {
        await this.repository.update(id, data)
    }
}
