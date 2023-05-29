import axios from 'axios';
import {describe, expect, it} from '@jest/globals';

import {ConfigResource, HttpService} from '@core/http';
import {Config, Scenario} from '@models/config';

jest.mock('axios');

describe('config', () => {
  let config: Config;

  beforeAll(() => {
    const httpService = new HttpService('http://localhost:4200');
    const resource = new ConfigResource(httpService);
    config = new Config(resource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('has dump method', async () => {
    await config.dump();
    expect(axios.get).toHaveBeenCalledTimes(1);
  });

  it('has summary method', async () => {
    await config.summary();
    expect(axios.get).toHaveBeenCalledTimes(1);
  });

  it('has scenario method', () => {
    const scenario = config.scenario();
    expect(scenario).toBeInstanceOf(Scenario);
  });
});
