import {ConfigResource} from '../../core/http';

export default class Config {
  resource: ConfigResource;

  constructor(resource: ConfigResource) {
    this.resource = resource;
  }

  dump() {
    return this.resource.show();
  }

  scenario() {}
}
