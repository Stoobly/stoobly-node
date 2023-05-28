import {ConfigResource} from '@core/http';
import {AgentConfig} from './services/agent-config';

export default class Scenario {
  resource: ConfigResource;

  constructor(resource: ConfigResource) {
    this.resource = resource;
  }

  async set(key: string) {
    const response = await this.resource.show();

    const agentConfig = new AgentConfig(response.data);

    agentConfig.setScenario(key);

    return this.resource.update(agentConfig.toHash());
  }
}
