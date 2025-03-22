import {DEFAULT_UI_URL} from './constants/config';
import {ConfigResource, HttpService} from './core/http';
import {Interceptor} from './core/interceptor';
import {Config} from './models/config';
import {ApplyScenarioOptions} from './types/options';

export default class Stoobly {
  httpService: HttpService;
  interceptor: Interceptor;

  constructor() {
    this.httpService = new HttpService(DEFAULT_UI_URL);
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
    if (this.interceptor.applied) {
      this.interceptor.clear();
    } 

    if (scenarioKey) {
      this.interceptor.withScenario(scenarioKey);
      return this.interceptor.apply(options?.sessionId);
    }
  } 
}
