import BaseService from './base-service';
import LoggerMixing from './logger-mixing';

export default abstract class BaseController extends LoggerMixing {
  protected service: BaseService;
}
