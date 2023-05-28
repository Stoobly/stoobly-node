import HttpService from './http.service';

export default class ConfigResource {
  CONFIGS_ENDPOINT = '/configs';

  constructor(
    private httpService: HttpService,
  ) {}

  summary(queryParams = {}) {
    return this.httpService.show([this.CONFIGS_ENDPOINT, 'summary'], queryParams);
  }

  policies() {
    return this.httpService.show([this.CONFIGS_ENDPOINT, 'policies']);
  }

  show(queryParams?: any) {
    return this.httpService.show([this.CONFIGS_ENDPOINT], queryParams);
  }

  create(body: object) {
    return this.httpService.create([this.CONFIGS_ENDPOINT], body);
  }

  update(body: object) {
    return this.httpService.update([this.CONFIGS_ENDPOINT], body);
  }
}
