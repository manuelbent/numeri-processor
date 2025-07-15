export default interface GeolocationServiceInterface {
    evaluate(ip: string|undefined): Promise<IpDetails|undefined>
}