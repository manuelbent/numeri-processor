export default interface AnalyticsEventServiceInterface {
    create(data: object): Promise<void>
}