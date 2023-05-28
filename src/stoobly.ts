import {ConfigResource, HttpService} from './core/http';
import {Config} from './models/config';

export default class Stoobly {
  httpService: HttpService;

  constructor() {
    this.httpService = new HttpService('http://localhost:4200');
  }

  withApiUrl(apiUrl: string) {
    this.httpService = new HttpService(apiUrl);
    return this;
  }

  get config() {
    const resource = new ConfigResource(this.httpService);
    return new Config(resource);
  }
}
