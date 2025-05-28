import { Mastra } from '@mastra/core';
import { turkishCultureAgent } from './agents/turkishCultureAgent';

export const mastra = new Mastra({
  agents: {
    turkishCultureAgent
  }
});
        