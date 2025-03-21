import {ConfigResource, HttpService} from './core/http';
import {Interceptor} from './core/interceptor';
import {Config} from './models/config';
import {ApplyScenarioOptions} from './types/options';

export default class Stoobly {
  httpService: HttpService;
  interceptor: Interceptor;

  constructor() {
    this.httpService = new HttpService('http://localhost:4200');
    this.interceptor = new Interceptor();
  }

  get config() {
    const resource = new ConfigResource(this.httpService);
    return new Config(resource);
  }

  set apiUrl(url: string) {
    this.httpService = new HttpService(url);
  }

  applyScenario(scenarioKey?: string, options?: ApplyScenarioOptions) {
    if (this.interceptor.active) {
      this.interceptor.deactivate();
    } 

    if (scenarioKey) {
      this.interceptor.withScenario(scenarioKey, options?.sessionId);
      this.interceptor.activate();
    }
  } 
}
