import { ProcessedEvent, Payload, RawEvent } from 'numeri-core'

/**
 * @interface EventServiceInterface
 */
export default interface EventServiceInterface {
    getRawById(id: number): Promise<RawEvent|null>

    updateRawById(id: number, data: object): Promise<void>

    createProcessed(data: object): Promise<ProcessedEvent>

    evaluateVisitorId(payload: Payload): string
}
