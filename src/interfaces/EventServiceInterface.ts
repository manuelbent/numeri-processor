import { ProcessedEvent, Payload, RawEvent } from '@manuelbent/numeri-core'

/**
 * @interface EventServiceInterface
 */
export default interface EventServiceInterface {
    getRawById(id: number): Promise<RawEvent|null>

    updateRawById(id: number, data: object): Promise<void>

    createProcessed(data: object): Promise<ProcessedEvent>

    evaluateVisitorId(payload: Payload): string
}
