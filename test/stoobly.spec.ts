import {describe, expect, it} from '@jest/globals';

import {Config} from '@models/config';

import Stoobly from '../src/stoobly';

describe('stoobly', () => {
  it('has config property', () => {
    const stoobly = new Stoobly();
    expect(stoobly.config).toBeInstanceOf(Config);
  });
});
