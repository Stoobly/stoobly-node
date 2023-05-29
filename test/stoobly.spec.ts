import {describe, expect, it} from '@jest/globals';

import Stoobly from '../src/stoobly';
import {Config} from '@models/config';

describe('stoobly', () => {
  it('has config property', () => {
    const stoobly = new Stoobly();
    expect(stoobly.config).toBeInstanceOf(Config);
  });
});
