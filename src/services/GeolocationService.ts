import axios, { AxiosInstance } from 'axios'
import { logger } from '@manuelbent/numeri-core'
import GeolocationServiceInterface from '../interfaces/GeolocationServiceInterface'

/**
 * @class GeolocationService
 */
export default class GeolocationService implements GeolocationServiceInterface {
    /**
     * @property {Map<string, IpDetails>} cache
     * @private
     */
    private cache = new Map<string, IpDetails>()

    /**
     * @property {AxiosInstance} client
     * @private
     */
    private readonly client: AxiosInstance

    /**
     * @property {string[]} excludedIps
     * @private
     */
    private readonly excludedIps: string[] = [
        '::1',
        '127.0.0.1',
        'localhost',
    ]

    /**
     * @constructor
     */
    constructor() {
        this.client = axios.create({ baseURL: 'https://ipapi.co' })
    }

    /**
     * Evaluate the geolocation of an IP address.
     * @param {string|undefined} ip
     * @return {Promise<IpDetails|undefined>}
     */
    async evaluate(ip: string|undefined): Promise<IpDetails|undefined> {
        if (!ip) {
            return undefined
        }

        if (this.excludedIps.includes(ip)) {
            return undefined
        }

        if (!this.cache.has(ip)) {
            try {
                const { data } = await this.client.get<IpApiInfo>(`/${ip}/json/`)
                const geolocation: IpDetails = {
                    continentCode: data.continent_code,
                    countryName: data.country_name,
                    countryCode: data.country_code,
                    region: data.region,
                }
                this.cache.set(ip, geolocation)
            } catch (err) {
                if (!axios.isAxiosError(err)) {
                    logger.error(err, 'Something went wrong server-side while fetching geolocation data')
                    return undefined
                }
                if (err.response) {
                    logger.error(err, `Something went wrong [${err.response.status}] while fetching geolocation`)
                    return undefined
                }
                if (err.request) {
                    logger.error(err, 'No response received while fetching geolocation')
                    return undefined
                }
                logger.error(err, 'An unexpected error occurred while fetching geolocation')
                return undefined
            }
        }

        return this.cache.get(ip)
    }
}
