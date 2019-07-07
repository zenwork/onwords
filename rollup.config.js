import createDefaultConfig from '@open-wc/building-rollup/modern-and-legacy-config';

import litcss     from 'rollup-plugin-lit-css';
import typescript from 'rollup-plugin-typescript2';

// if you need to support IE11 use "modern-and-legacy-config" instead.
// import createDefaultConfig from '@open-wc/building-rollup/modern-and-legacy-config';

const configs = createDefaultConfig({
                                      input: './index.html',
                                      extensions: ['.js', '.mjs', '.ts'],
                                    });

export default configs.map(config => ({
  ...config,
  plugins: [
    ...config.plugins,
    typescript(),
    // litcss(),
  ],
}))
;
