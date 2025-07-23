import { TrackingEvent } from 'numeri-core'

/**
 * @interface TrackingEventServiceInterface
 */
export default interface TrackingEventServiceInterface {
    getById(id: number): Promise<TrackingEvent|null>
    update(id: number, data: object): Promise<void>
}
