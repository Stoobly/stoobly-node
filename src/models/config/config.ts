import {ConfigResource} from '../../core/http';

export default class Config {
  resource: ConfigResource;

  constructor(resource: ConfigResource) {
    this.resource = resource;
  }

  async dump() {
    return await this.resource.show();
  }

  scenario() {}
}
