import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'fixtable',
  outputTargets:[
    {
      type: 'dist'
    },
    {
      type: 'www',
      serviceWorker: null
    }
  ]
};
