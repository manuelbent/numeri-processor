// common resources
import {
    RawEventRepository,
    ProcessedEventRepository
} from 'numeri-core'
// controllers
import ProcessorController from '../controllers/ProcessorController'
// services
import GeolocationService from '../services/GeolocationService'
import EventService from '../services/EventService'


/**
 * Dependency Injection Container.
 * @class Container
 */
class Container {
    public geolocationService: GeolocationService = new GeolocationService()
    public eventService: EventService = new EventService(new RawEventRepository(), new ProcessedEventRepository())
    public processorController: ProcessorController = new ProcessorController(this.eventService, this.geolocationService)
}

export default new Container()
