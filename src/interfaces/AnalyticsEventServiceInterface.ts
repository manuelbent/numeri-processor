import { AnalyticsEvent, Payload } from 'numeri-core'

/**
 * @interface AnalyticsEventServiceInterface
 */
export default interface AnalyticsEventServiceInterface {
    create(data: object): Promise<AnalyticsEvent>
    evaluateVisitorId(payload: Payload): string
}
