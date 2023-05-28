import {ConfigResource, HttpService} from './resources';

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
    return new ConfigResource(this.httpService);
  }
}
