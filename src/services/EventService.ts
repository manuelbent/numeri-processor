import {
    Payload,
    ProcessedEvent,
    ProcessedEventRepositoryInterface,
    RawEvent,
    RawEventRepositoryInterface,
} from 'numeri-core'
import EventServiceInterface from '../interfaces/EventServiceInterface'

/**
 * @class EventService
 */
export default class EventService implements EventServiceInterface {
    /**
     * @constructor
     * @param {RawEventRepositoryInterface} rawEventRepository
     * @param {ProcessedEventRepositoryInterface} processedEventRepository
     */
    constructor(
        private rawEventRepository: RawEventRepositoryInterface,
        private processedEventRepository: ProcessedEventRepositoryInterface
    ) {}

    /**
     * @param {number} id
     * @return {Promise<RawEvent|null>}
     */
    async getRawById(id: number): Promise<RawEvent|null> {
        return this.rawEventRepository.findById(id)
    }

    /**
     * @param {number} id
     * @param {object} data
     * @returns {Promise<void>}
     */
    async updateRawById(id: number, data: object): Promise<void> {
        await this.rawEventRepository.update(id, data)
    }

    /**
     * @param {object} data
     * @return {Promise<ProcessedEvent>}
     */
    async createProcessed(data: object): Promise<ProcessedEvent> {
        return this.processedEventRepository.create(data)
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
