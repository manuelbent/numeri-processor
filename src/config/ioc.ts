// common resources
import {
    AnalyticsEventRepository,
    TrackingEventRepository
} from 'numeri-core'
// controllers
import ProcessorController from '../controllers/ProcessorController'
// services
import GeolocationService from '../services/GeolocationService'
import AnalyticsEventService from '../services/AnalyticsEventService'
import TrackingEventService from '../services/TrackingEventService'

/**
 * Dependency Injection Container.
 * @class Container
 */
class Container {
    public geolocationService: GeolocationService = new GeolocationService()
    public analyticsEventService: AnalyticsEventService = new AnalyticsEventService(new AnalyticsEventRepository())
    public trackingEventService: TrackingEventService = new TrackingEventService(new TrackingEventRepository())
    public processorController: ProcessorController = new ProcessorController(this.trackingEventService, this.geolocationService, this.analyticsEventService)
}

export default new Container()
