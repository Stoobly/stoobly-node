import {ConfigResource} from '@core/http';

import Scenario from './scenario';

export default class Config {
  resource: ConfigResource;

  constructor(resource: ConfigResource) {
    this.resource = resource;
  }

  dump() {
    return this.resource.show();
  }

  get scenario() {
    return new Scenario(this.resource);
  }

  summary() {
    return this.resource.summary();
  }
}
