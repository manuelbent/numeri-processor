import GeolocationService from '../services/GeolocationService'
import AnalyticsEventService from '../services/AnalyticsEventService'
import TrackingEventService from '../services/TrackingEventService'

/**
 * Dependency Injection Container.
 * @class Container
 */
class Container {
    public geolocationService: GeolocationService = new GeolocationService()
    public analyticsEventService: AnalyticsEventService = new AnalyticsEventService()
    public trackingEventService: TrackingEventService = new TrackingEventService(this.geolocationService, this.analyticsEventService)
}

export default new Container()
