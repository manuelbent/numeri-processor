import axios, { AxiosInstance } from 'axios'

export default class GeolocationService {
    private cache = new Map<string, IpDetails>()

    private readonly client: AxiosInstance

    constructor() {
        this.client = axios.create({ baseURL: 'https://ipapi.co' })
    }

    async evaluate(ip: string|undefined): Promise<IpDetails|undefined> {
        if (!ip) {
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
                    city: data.city,
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
