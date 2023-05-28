import { describe, expect, it } from '@jest/globals';

import Stoobly from '../src/stoobly';
import { ConfigResource } from '../src/resources';

describe('stoobly', () => {
  it('has config property', () => {
    const stoobly = new Stoobly();
    expect(stoobly.config).toBeInstanceOf(ConfigResource);
  });
});