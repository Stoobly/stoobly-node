import {AgentConfigResponse} from '../../models/config/types/config-response';
import HttpService from './http.service';
import {QueryParams} from './types';

export default class ConfigResource {
  CONFIGS_ENDPOINT = '/configs';

  httpService: HttpService;

  constructor(httpService: HttpService) {
    this.httpService = httpService;
  }

  summary(queryParams = {}) {
    return this.httpService.show(
      [this.CONFIGS_ENDPOINT, 'summary'],
      queryParams
    );
  }

  policies() {
    return this.httpService.show([this.CONFIGS_ENDPOINT, 'policies']);
  }

  show(queryParams?: QueryParams) {
    return this.httpService.show<AgentConfigResponse>(
      [this.CONFIGS_ENDPOINT],
      queryParams
    );
  }

  create(body: any) {
    return this.httpService.create([this.CONFIGS_ENDPOINT], body);
  }

  update(body: any) {
    return this.httpService.update<AgentConfigResponse>(
      [this.CONFIGS_ENDPOINT],
      body
    );
  }
}
